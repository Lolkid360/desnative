package main

import (
	"context"
	"io/ioutil"
	"os"
	"path/filepath"
	"sort"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx         context.Context
	alwaysOnTop bool
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.alwaysOnTop = false
}

// ToggleAlwaysOnTop toggles the always-on-top state
func (a *App) ToggleAlwaysOnTop() bool {
	a.alwaysOnTop = !a.alwaysOnTop
	runtime.WindowSetAlwaysOnTop(a.ctx, a.alwaysOnTop)
	return a.alwaysOnTop
}

// IsAlwaysOnTop returns the current always-on-top state
func (a *App) IsAlwaysOnTop() bool {
	return a.alwaysOnTop
}

// SaveHistory saves the history to a timestamped file and maintains only the last 5
func (a *App) SaveHistory(content string) error {
	// Get user home directory
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return err
	}

	// Create history directory
	historyDir := filepath.Join(homeDir, ".desnative", "history")
	if err := os.MkdirAll(historyDir, 0755); err != nil {
		return err
	}

	// Create timestamped filename
	timestamp := time.Now().Format("20060102_150405")
	filename := filepath.Join(historyDir, "history_"+timestamp+".json")

	// Write file
	if err := ioutil.WriteFile(filename, []byte(content), 0644); err != nil {
		return err
	}

	// Clean up old files (keep only last 5)
	files, err := ioutil.ReadDir(historyDir)
	if err != nil {
		return err
	}

	// Filter only history files
	var historyFiles []os.FileInfo
	for _, f := range files {
		if !f.IsDir() && filepath.Ext(f.Name()) == ".json" {
			historyFiles = append(historyFiles, f)
		}
	}

	// Sort by modification time (newest first)
	sort.Slice(historyFiles, func(i, j int) bool {
		return historyFiles[i].ModTime().After(historyFiles[j].ModTime())
	})

	// Delete files beyond the 5th
	for i := 5; i < len(historyFiles); i++ {
		os.Remove(filepath.Join(historyDir, historyFiles[i].Name()))
	}

	return nil
}

// ExportHistory opens a save dialog and exports history
func (a *App) ExportHistory(content string) error {
	filename, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		DefaultFilename: "calculator_history.json",
		Title:           "Export History",
		Filters: []runtime.FileFilter{
			{DisplayName: "JSON Files (*.json)", Pattern: "*.json"},
		},
	})

	if err != nil {
		return err
	}

	if filename == "" {
		return nil // User cancelled
	}

	return ioutil.WriteFile(filename, []byte(content), 0644)
}

// ImportHistory opens a file dialog and returns the content
func (a *App) ImportHistory() (string, error) {
	filename, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Import History",
		Filters: []runtime.FileFilter{
			{DisplayName: "JSON Files (*.json)", Pattern: "*.json"},
		},
	})

	if err != nil {
		return "", err
	}

	if filename == "" {
		return "", nil // User cancelled
	}

	content, err := ioutil.ReadFile(filename)
	if err != nil {
		return "", err
	}

	return string(content), nil
}
