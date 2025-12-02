package main

import (
	"context"

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
