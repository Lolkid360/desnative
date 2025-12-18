// Package main provides the Desnative Calculator application.
// This is a Wails-based desktop calculator with LaTeX support.
package main

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// Application configuration constants
const (
	// maxHistoryFiles is the maximum number of history backup files to keep
	maxHistoryFiles = 5

	// historyDirName is the subdirectory name for storing history files
	historyDirName = "history"

	// appDirName is the application configuration directory name
	appDirName = ".desnative"
)

// App represents the main application structure.
// It holds the application context and state that needs to persist
// across method calls from the frontend.
type App struct {
	ctx         context.Context
	alwaysOnTop bool
}

// NewApp creates and returns a new App instance with default values.
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
	historyDir := filepath.Join(homeDir, appDirName, historyDirName)
	if err := os.MkdirAll(historyDir, 0755); err != nil {
		return err
	}

	// Create timestamped filename
	timestamp := time.Now().Format("20060102_150405")
	filename := filepath.Join(historyDir, "history_"+timestamp+".json")

	// Write file
	if err := os.WriteFile(filename, []byte(content), 0644); err != nil {
		return err
	}

	// Clean up old files (keep only last 5)
	entries, err := os.ReadDir(historyDir)
	if err != nil {
		return err
	}

	// Filter only history files and get FileInfo for sorting
	type fileWithInfo struct {
		name    string
		modTime time.Time
	}
	var historyFiles []fileWithInfo
	for _, entry := range entries {
		if !entry.IsDir() && filepath.Ext(entry.Name()) == ".json" {
			info, err := entry.Info()
			if err != nil {
				continue // Skip files we can't stat
			}
			historyFiles = append(historyFiles, fileWithInfo{
				name:    entry.Name(),
				modTime: info.ModTime(),
			})
		}
	}

	// Sort by modification time (newest first)
	sort.Slice(historyFiles, func(i, j int) bool {
		return historyFiles[i].modTime.After(historyFiles[j].modTime)
	})

	// Delete files beyond the configured limit
	for i := maxHistoryFiles; i < len(historyFiles); i++ {
		_ = os.Remove(filepath.Join(historyDir, historyFiles[i].name))
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

	return os.WriteFile(filename, []byte(content), 0644)
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

	content, err := os.ReadFile(filename)
	if err != nil {
		return "", err
	}

	return string(content), nil
}

// UpdateInfo struct
type UpdateInfo struct {
	Available    bool   `json:"available"`
	Version      string `json:"version"`
	DownloadURL  string `json:"downloadUrl"`
	ReleaseNotes string `json:"releaseNotes"`
}

// GetAppVersion returns the current app version
func (a *App) GetAppVersion() string {
	return "112" // TODO: Read from build flags or config
}

// CheckForUpdates checks for updates from a remote JSON file
func (a *App) CheckForUpdates(url string) (UpdateInfo, error) {
	// Default URL if empty
	if url == "" {
		url = "https://Lolkid360.github.io/desnative/version.json"
	}

	resp, err := http.Get(url)
	if err != nil {
		return UpdateInfo{}, err
	}
	defer resp.Body.Close()

	var info UpdateInfo
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return UpdateInfo{}, err
	}

	// Reset Available flag to false, we will determine it based on version comparison
	info.Available = false

	// Version comparison (Greater Than)
	currentVersion := a.GetAppVersion()

	// Try integer comparison (e.g., "100" vs "101")
	currInt, err1 := strconv.Atoi(currentVersion)
	remoteInt, err2 := strconv.Atoi(info.Version)

	if err1 == nil && err2 == nil {
		if remoteInt > currInt {
			info.Available = true
		}
	} else {
		// Fallback for non-integer versions (e.g. "1.0.0")
		// For now, just check if different, or implement semver later
		if info.Version != currentVersion {
			info.Available = true
		}
	}

	return info, nil
}

// DownloadUpdate opens the download URL in the user's default browser
func (a *App) DownloadUpdate(url string) error {
	runtime.BrowserOpenURL(a.ctx, url)
	return nil
}

