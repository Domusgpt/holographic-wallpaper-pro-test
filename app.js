/**
 * Holographic Wallpaper Pro - Main Application
 * Advanced editor and rendering system integration
 */

import { HolographicEngine } from './HolographicEngine.js';

class HolographicApp {
    constructor() {
        this.engine = null;
        this.currentTab = 'presets';
        this.isEditorMinimized = false;
        this.isLoading = true;
        
        // Preset data
        this.presets = [
            {
                name: 'Cyberpunk',
                preview: 'linear-gradient(45deg, #ff006f, #00ffff)',
                config: {
                    geometry: { primary: 1, density: 2.0, complexity: 4, morph: 0.6, chaos: 0.4 },
                    colors: { primaryHue: 300, secondaryHue: 180, saturation: 0.9, brightness: 0.8, glow: 0.7 },
                    animation: { baseSpeed: 1.2, rotationX: 0.8, rotationY: 0.6, pulse: 0.7 }
                }
            },
            {
                name: 'Ocean Wave',
                preview: 'linear-gradient(45deg, #0066ff, #00ffaa)',
                config: {
                    geometry: { primary: 6, density: 1.2, complexity: 3, morph: 0.8, chaos: 0.3 },
                    colors: { primaryHue: 200, secondaryHue: 240, saturation: 0.8, brightness: 0.7, glow: 0.5 },
                    animation: { baseSpeed: 0.8, waveAmplitude: 0.6, pulse: 0.4 }
                }
            },
            {
                name: 'Crystal Matrix',
                preview: 'linear-gradient(45deg, #ff8800, #ffff00)',
                config: {
                    geometry: { primary: 7, density: 1.8, complexity: 5, morph: 0.2, chaos: 0.1 },
                    colors: { primaryHue: 30, secondaryHue: 60, saturation: 0.9, brightness: 0.9, glow: 0.8 },
                    animation: { baseSpeed: 0.5, rotationX: 0.3, rotationY: 0.3, rotationZ: 0.3 }
                }
            },
            {
                name: 'Plasma Storm',
                preview: 'linear-gradient(45deg, #ff0066, #6600ff)',
                config: {
                    geometry: { primary: 5, density: 2.5, complexity: 6, morph: 0.9, chaos: 0.8 },
                    colors: { primaryHue: 320, secondaryHue: 260, saturation: 1.0, brightness: 0.8, glow: 0.9 },
                    animation: { baseSpeed: 1.5, pulse: 0.8, breathingEffect: true }
                }
            },
            {
                name: 'Neon Grid',
                preview: 'linear-gradient(45deg, #00ff88, #0088ff)',
                config: {
                    geometry: { primary: 1, secondary: 0, blendAmount: 30, density: 1.5, complexity: 4 },
                    colors: { primaryHue: 160, secondaryHue: 200, saturation: 0.9, brightness: 0.8, glow: 0.6 },
                    animation: { baseSpeed: 1.0, rotationY: 0.5 }
                }
            },
            {
                name: 'Ethereal',
                preview: 'linear-gradient(45deg, #ffffff, #aaffff)',
                config: {
                    geometry: { primary: 2, density: 0.8, complexity: 2, morph: 0.3, chaos: 0.1 },
                    colors: { primaryHue: 180, secondaryHue: 200, saturation: 0.3, brightness: 0.9, glow: 0.4 },
                    animation: { baseSpeed: 0.3, pulse: 0.2, breathingEffect: true }
                }
            }
        ];
        
        // Color palettes
        this.colorPalettes = [
            { name: 'Cyberpunk', colors: [300, 180], preview: 'linear-gradient(90deg, #ff006f, #00ffff)' },
            { name: 'Sunset', colors: [20, 50], preview: 'linear-gradient(90deg, #ff4500, #ffa500)' },
            { name: 'Ocean', colors: [200, 240], preview: 'linear-gradient(90deg, #0066ff, #00aaff)' },
            { name: 'Forest', colors: [120, 80], preview: 'linear-gradient(90deg, #228b22, #90ee90)' },
            { name: 'Purple Dream', colors: [280, 320], preview: 'linear-gradient(90deg, #8a2be2, #ff69b4)' },
            { name: 'Fire', colors: [0, 30], preview: 'linear-gradient(90deg, #ff0000, #ff8c00)' },
            { name: 'Ice', colors: [180, 220], preview: 'linear-gradient(90deg, #87ceeb, #b0e0e6)' },
            { name: 'Gold', colors: [45, 60], preview: 'linear-gradient(90deg, #ffd700, #ffff00)' }
        ];
        
        this.init();
    }
    
    async init() {
        this.showLoadingScreen();
        
        try {
            // Initialize engine
            this.engine = new HolographicEngine('holoCanvas');
            
            // Setup UI
            this.setupUI();
            this.loadPresets();
            this.loadColorPalettes();
            this.setupEventListeners();
            
            // Start render loop
            this.startRenderLoop();
            
            // Hide loading screen
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 2000);
            
            this.showToast('Holographic Engine initialized successfully!', 'success');
            
        } catch (error) {
            console.error('Failed to initialize:', error);
            this.showToast('Failed to initialize WebGL. Please check your browser support.', 'error');
            this.hideLoadingScreen();
        }
    }
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.remove('fade-out');
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        this.isLoading = false;
    }
    
    setupUI() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });
        
        // Control bindings
        this.bindControls();
        
        // Quick toolbar
        this.setupQuickToolbar();
    }
    
    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update active tab panel
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        this.currentTab = tabName;
    }
    
    bindControls() {
        // Geometry controls
        this.bindControl('geometrySelect', 'geometry.primary', 'change');
        this.bindControl('geometryBlendSelect', 'geometry.secondary', 'change');
        this.bindControl('blendAmount', 'geometry.blendAmount', 'input');
        this.bindControl('densityRange', 'geometry.density', 'input');
        this.bindControl('complexityRange', 'geometry.complexity', 'input');
        this.bindControl('morphRange', 'geometry.morph', 'input');
        this.bindControl('chaosRange', 'geometry.chaos', 'input');
        
        // Color controls
        this.bindControl('colorModeSelect', 'colors.mode', 'change');
        this.bindControl('hueRange', 'colors.primaryHue', 'input');
        this.bindControl('hue2Range', 'colors.secondaryHue', 'input');
        this.bindControl('saturationRange', 'colors.saturation', 'input');
        this.bindControl('brightnessRange', 'colors.brightness', 'input');
        this.bindControl('glowRange', 'colors.glow', 'input');
        this.bindControl('colorSpeedRange', 'colors.colorSpeed', 'input');
        
        // Animation controls
        this.bindControl('easingSelect', 'animation.easing', 'change');
        this.bindControl('speedRange', 'animation.baseSpeed', 'input');
        this.bindControl('rotXRange', 'animation.rotationX', 'input');
        this.bindControl('rotYRange', 'animation.rotationY', 'input');
        this.bindControl('rotZRange', 'animation.rotationZ', 'input');
        this.bindControl('pulseRange', 'animation.pulse', 'input');
        this.bindControl('waveAmpRange', 'animation.waveAmplitude', 'input');
        this.bindControl('autoRotate', 'animation.autoRotate', 'change');
        this.bindControl('breathingEffect', 'animation.breathingEffect', 'change');
        this.bindControl('particleMode', 'animation.particleMode', 'change');
        
        // Interaction controls
        this.bindControl('mouseReactRange', 'interaction.mouseReactivity', 'input');
        this.bindControl('touchSensRange', 'interaction.touchSensitivity', 'input');
        this.bindControl('scrollParallaxRange', 'interaction.scrollParallax', 'input');
        this.bindControl('audioReactive', 'interaction.audioReactive', 'change');
        this.bindControl('gyroEnabled', 'interaction.gyroEnabled', 'change');
        this.bindControl('clickRipples', 'interaction.clickRipples', 'change');
        this.bindControl('magneticMouse', 'interaction.magneticMouse', 'change');
        this.bindControl('bassRange', 'interaction.bassResponse', 'input');
        this.bindControl('midRange', 'interaction.midResponse', 'input');
        this.bindControl('highRange', 'interaction.highResponse', 'input');
    }
    
    bindControl(elementId, configPath, eventType) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.addEventListener(eventType, (e) => {
            const value = element.type === 'checkbox' ? element.checked : 
                         element.type === 'range' ? parseFloat(element.value) :
                         element.type === 'select-one' ? (isNaN(element.value) ? element.value : parseFloat(element.value)) :
                         element.value;
            
            this.setConfigValue(configPath, value);
            this.updateDisplayValue(elementId, value);
            this.updateEngine();
        });
        
        // Set initial value
        const currentValue = this.getConfigValue(configPath);
        if (currentValue !== undefined) {
            if (element.type === 'checkbox') {
                element.checked = currentValue;
            } else {
                element.value = currentValue;
            }
            this.updateDisplayValue(elementId, currentValue);
        }
    }
    
    setConfigValue(path, value) {
        const keys = path.split('.');
        let obj = this.engine.config;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]]) obj[keys[i]] = {};
            obj = obj[keys[i]];
        }
        
        obj[keys[keys.length - 1]] = value;
    }
    
    getConfigValue(path) {
        const keys = path.split('.');
        let obj = this.engine.config;
        
        for (const key of keys) {
            if (obj === undefined || obj[key] === undefined) return undefined;
            obj = obj[key];
        }
        
        return obj;
    }
    
    updateDisplayValue(elementId, value) {
        const displayElements = {
            'blendAmount': (v) => `${v}%`,
            'densityRange': (v) => v.toFixed(2),
            'complexityRange': (v) => v.toString(),
            'morphRange': (v) => v.toFixed(2),
            'chaosRange': (v) => v.toFixed(2),
            'hueRange': (v) => `${Math.round(v)}°`,
            'hue2Range': (v) => `${Math.round(v)}°`,
            'saturationRange': (v) => v.toFixed(2),
            'brightnessRange': (v) => v.toFixed(2),
            'glowRange': (v) => v.toFixed(2),
            'colorSpeedRange': (v) => v.toFixed(2),
            'speedRange': (v) => v.toFixed(2),
            'rotXRange': (v) => v.toFixed(2),
            'rotYRange': (v) => v.toFixed(2),
            'rotZRange': (v) => v.toFixed(2),
            'pulseRange': (v) => v.toFixed(2),
            'waveAmpRange': (v) => v.toFixed(2),
            'mouseReactRange': (v) => v.toFixed(2),
            'touchSensRange': (v) => v.toFixed(2),
            'scrollParallaxRange': (v) => v.toFixed(2),
            'bassRange': (v) => v.toFixed(2),
            'midRange': (v) => v.toFixed(2),
            'highRange': (v) => v.toFixed(2)
        };
        
        const valueElementId = elementId.replace('Range', 'Value').replace('Select', 'Value');
        const valueElement = document.getElementById(valueElementId);
        
        if (valueElement && displayElements[elementId]) {
            valueElement.textContent = displayElements[elementId](value);
        }
    }
    
    updateEngine() {
        if (this.engine) {
            this.engine.updateConfig(this.engine.config);
        }
    }
    
    loadPresets() {
        const presetGrid = document.getElementById('presetGrid');
        if (!presetGrid) return;
        
        presetGrid.innerHTML = '';
        
        this.presets.forEach((preset, index) => {
            const presetElement = document.createElement('div');
            presetElement.className = 'preset-item';
            presetElement.innerHTML = `
                <div class="preset-preview" style="background: ${preset.preview}"></div>
                <div class="preset-name">${preset.name}</div>
            `;
            
            presetElement.addEventListener('click', () => {
                this.applyPreset(preset);
                this.highlightPreset(presetElement);
            });
            
            presetGrid.appendChild(presetElement);
        });
    }
    
    loadColorPalettes() {
        const paletteGrid = document.getElementById('paletteGrid');
        if (!paletteGrid) return;
        
        paletteGrid.innerHTML = '';
        
        this.colorPalettes.forEach(palette => {
            const paletteElement = document.createElement('div');
            paletteElement.className = 'palette-item';
            paletteElement.style.background = palette.preview;
            paletteElement.title = palette.name;
            
            paletteElement.addEventListener('click', () => {
                this.applyColorPalette(palette);
            });
            
            paletteGrid.appendChild(paletteElement);
        });
    }
    
    applyPreset(preset) {
        Object.assign(this.engine.config, preset.config);
        this.updateAllControls();
        this.updateEngine();
        this.showToast(`Applied preset: ${preset.name}`, 'success');
    }
    
    applyColorPalette(palette) {
        this.engine.config.colors.primaryHue = palette.colors[0];
        this.engine.config.colors.secondaryHue = palette.colors[1];
        this.updateColorControls();
        this.updateEngine();
        this.showToast(`Applied palette: ${palette.name}`, 'success');
    }
    
    highlightPreset(element) {
        document.querySelectorAll('.preset-item').forEach(item => {
            item.classList.remove('active');
        });
        element.classList.add('active');
    }
    
    updateAllControls() {
        this.updateGeometryControls();
        this.updateColorControls();
        this.updateAnimationControls();
        this.updateInteractionControls();
    }
    
    updateGeometryControls() {
        const controls = ['geometrySelect', 'geometryBlendSelect', 'blendAmount', 'densityRange', 'complexityRange', 'morphRange', 'chaosRange'];
        controls.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const configPath = this.getConfigPathForControl(id);
                const value = this.getConfigValue(configPath);
                if (value !== undefined) {
                    if (element.type === 'checkbox') {
                        element.checked = value;
                    } else {
                        element.value = value;
                    }
                    this.updateDisplayValue(id, value);
                }
            }
        });
    }
    
    updateColorControls() {
        const controls = ['hueRange', 'hue2Range', 'saturationRange', 'brightnessRange', 'glowRange', 'colorSpeedRange'];
        controls.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const configPath = this.getConfigPathForControl(id);
                const value = this.getConfigValue(configPath);
                if (value !== undefined) {
                    element.value = value;
                    this.updateDisplayValue(id, value);
                }
            }
        });
    }
    
    updateAnimationControls() {
        const controls = ['speedRange', 'rotXRange', 'rotYRange', 'rotZRange', 'pulseRange', 'waveAmpRange', 'autoRotate', 'breathingEffect', 'particleMode'];
        controls.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const configPath = this.getConfigPathForControl(id);
                const value = this.getConfigValue(configPath);
                if (value !== undefined) {
                    if (element.type === 'checkbox') {
                        element.checked = value;
                    } else {
                        element.value = value;
                        this.updateDisplayValue(id, value);
                    }
                }
            }
        });
    }
    
    updateInteractionControls() {
        const controls = ['mouseReactRange', 'touchSensRange', 'scrollParallaxRange', 'audioReactive', 'gyroEnabled', 'clickRipples', 'magneticMouse'];
        controls.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const configPath = this.getConfigPathForControl(id);
                const value = this.getConfigValue(configPath);
                if (value !== undefined) {
                    if (element.type === 'checkbox') {
                        element.checked = value;
                    } else {
                        element.value = value;
                        this.updateDisplayValue(id, value);
                    }
                }
            }
        });
        
        // Update audio controls state
        this.updateAudioControlsState();
    }
    
    updateAudioControlsState() {
        const audioReactive = document.getElementById('audioReactive');
        const audioControls = document.getElementById('audioControls');
        const audioInputs = ['bassRange', 'midRange', 'highRange'];
        
        if (audioReactive && audioControls) {
            const isEnabled = audioReactive.checked;
            
            if (isEnabled) {
                audioControls.classList.remove('audio-disabled');
            } else {
                audioControls.classList.add('audio-disabled');
            }
            
            audioInputs.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.disabled = !isEnabled;
                }
            });
        }
    }
    
    getConfigPathForControl(controlId) {
        const pathMap = {
            'geometrySelect': 'geometry.primary',
            'geometryBlendSelect': 'geometry.secondary',
            'blendAmount': 'geometry.blendAmount',
            'densityRange': 'geometry.density',
            'complexityRange': 'geometry.complexity',
            'morphRange': 'geometry.morph',
            'chaosRange': 'geometry.chaos',
            'hueRange': 'colors.primaryHue',
            'hue2Range': 'colors.secondaryHue',
            'saturationRange': 'colors.saturation',
            'brightnessRange': 'colors.brightness',
            'glowRange': 'colors.glow',
            'colorSpeedRange': 'colors.colorSpeed',
            'speedRange': 'animation.baseSpeed',
            'rotXRange': 'animation.rotationX',
            'rotYRange': 'animation.rotationY',
            'rotZRange': 'animation.rotationZ',
            'pulseRange': 'animation.pulse',
            'waveAmpRange': 'animation.waveAmplitude',
            'autoRotate': 'animation.autoRotate',
            'breathingEffect': 'animation.breathingEffect',
            'particleMode': 'animation.particleMode',
            'mouseReactRange': 'interaction.mouseReactivity',
            'touchSensRange': 'interaction.touchSensitivity',
            'scrollParallaxRange': 'interaction.scrollParallax',
            'audioReactive': 'interaction.audioReactive',
            'gyroEnabled': 'interaction.gyroEnabled',
            'clickRipples': 'interaction.clickRipples',
            'magneticMouse': 'interaction.magneticMouse',
            'bassRange': 'interaction.bassResponse',
            'midRange': 'interaction.midResponse',
            'highRange': 'interaction.highResponse'
        };
        
        return pathMap[controlId];
    }
    
    setupQuickToolbar() {
        // Quick toolbar buttons are bound in the HTML onclick attributes
        // This would be where we could add additional toolbar functionality
    }
    
    setupEventListeners() {
        // Audio reactive checkbox
        const audioReactive = document.getElementById('audioReactive');
        if (audioReactive) {
            audioReactive.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.enableAudio();
                } else {
                    this.disableAudio();
                }
                this.updateAudioControlsState();
            });
        }
        
        // Import file
        const importFile = document.getElementById('importFile');
        if (importFile) {
            importFile.addEventListener('change', (e) => {
                this.handleFileImport(e.target.files[0]);
            });
        }
        
        // Window events
        window.addEventListener('beforeunload', () => {
            // Save current configuration to localStorage
            localStorage.setItem('holographicConfig', this.engine.exportAsJSON());
        });
        
        // Load saved configuration on startup
        const savedConfig = localStorage.getItem('holographicConfig');
        if (savedConfig) {
            setTimeout(() => {
                this.importConfiguration(savedConfig);
            }, 1000);
        }
    }
    
    async enableAudio() {
        try {
            const success = await this.engine.audioSystem.enable();
            if (success) {
                this.showToast('Audio reactive mode enabled', 'success');
            } else {
                this.showToast('Failed to enable audio access', 'error');
                document.getElementById('audioReactive').checked = false;
            }
        } catch (error) {
            this.showToast('Audio permission denied', 'error');
            document.getElementById('audioReactive').checked = false;
        }
    }
    
    disableAudio() {
        this.engine.audioSystem.enabled = false;
        this.showToast('Audio reactive mode disabled', 'warning');
    }
    
    handleFileImport(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = e.target.result;
                this.importConfiguration(jsonData);
                this.showToast('Configuration imported successfully', 'success');
            } catch (error) {
                this.showToast('Failed to import configuration', 'error');
            }
        };
        reader.readAsText(file);
    }
    
    importConfiguration(jsonData) {
        const success = this.engine.importFromJSON(jsonData);
        if (success) {
            this.updateAllControls();
            return true;
        }
        return false;
    }
    
    startRenderLoop() {
        const render = () => {
            if (this.engine && !this.isLoading) {
                this.engine.render();
            }
            requestAnimationFrame(render);
        };
        render();
    }
    
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Global functions for HTML onclick handlers
window.toggleEditor = function() {
    const app = window.holoApp;
    const panel = document.getElementById('editorPanel');
    
    app.isEditorMinimized = !app.isEditorMinimized;
    panel.classList.toggle('minimized', app.isEditorMinimized);
};

window.toggleFullscreen = function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(console.error);
    } else {
        document.exitFullscreen();
    }
};

window.randomizeAll = function() {
    const app = window.holoApp;
    if (!app.engine) return;
    
    // Randomize geometry
    app.engine.config.geometry.primary = Math.floor(Math.random() * 8);
    app.engine.config.geometry.density = 0.5 + Math.random() * 2;
    app.engine.config.geometry.complexity = 1 + Math.floor(Math.random() * 6);
    app.engine.config.geometry.morph = Math.random();
    app.engine.config.geometry.chaos = Math.random();
    
    // Randomize colors
    app.engine.config.colors.primaryHue = Math.floor(Math.random() * 360);
    app.engine.config.colors.secondaryHue = Math.floor(Math.random() * 360);
    app.engine.config.colors.saturation = 0.5 + Math.random() * 0.5;
    app.engine.config.colors.brightness = 0.5 + Math.random() * 0.5;
    app.engine.config.colors.glow = Math.random();
    
    // Randomize animation
    app.engine.config.animation.baseSpeed = 0.2 + Math.random() * 1.5;
    app.engine.config.animation.rotationX = -1 + Math.random() * 2;
    app.engine.config.animation.rotationY = -1 + Math.random() * 2;
    app.engine.config.animation.rotationZ = -1 + Math.random() * 2;
    app.engine.config.animation.pulse = Math.random();
    app.engine.config.animation.waveAmplitude = Math.random();
    
    app.updateAllControls();
    app.updateEngine();
    app.showToast('All parameters randomized!', 'success');
};

window.resetToDefaults = function() {
    const app = window.holoApp;
    if (!app.engine) return;
    
    // Reset to default configuration
    app.engine.config = {
        geometry: { primary: 6, secondary: -1, blendAmount: 0, density: 1.4, complexity: 3, morph: 0.4, chaos: 0.25 },
        colors: { mode: 'hsl', primaryHue: 200, secondaryHue: 260, saturation: 0.8, brightness: 0.7, glow: 0.5, colorSpeed: 0.2 },
        animation: { easing: 'easeInOutQuad', baseSpeed: 0.7, rotationX: 0.5, rotationY: 0.3, rotationZ: 0.2, pulse: 0.5, waveAmplitude: 0.3, autoRotate: true, breathingEffect: false, particleMode: false },
        interaction: { mouseReactivity: 0.8, touchSensitivity: 1.0, scrollParallax: 0.5, audioReactive: false, gyroEnabled: false, clickRipples: true, magneticMouse: false, bassResponse: 1.0, midResponse: 1.0, highResponse: 1.0 }
    };
    
    app.updateAllControls();
    app.updateEngine();
    app.showToast('Reset to default settings', 'warning');
};

window.shareConfiguration = function() {
    const app = window.holoApp;
    if (!app.engine) return;
    
    const config = app.engine.exportAsJSON();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    if (navigator.share) {
        navigator.share({
            title: 'Holographic Wallpaper Configuration',
            url: url
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(config).then(() => {
            app.showToast('Configuration copied to clipboard', 'success');
        });
    }
};

window.saveAsPreset = function() {
    const app = window.holoApp;
    if (!app.engine) return;
    
    const name = prompt('Enter preset name:');
    if (name) {
        const preset = {
            name: name,
            preview: `linear-gradient(45deg, hsl(${app.engine.config.colors.primaryHue}, 80%, 60%), hsl(${app.engine.config.colors.secondaryHue}, 80%, 60%))`,
            config: JSON.parse(JSON.stringify(app.engine.config))
        };
        
        app.presets.push(preset);
        app.loadPresets();
        app.showToast(`Preset "${name}" saved`, 'success');
    }
};

window.exportAsJSON = function() {
    const app = window.holoApp;
    if (!app.engine) return;
    
    const jsonData = app.engine.exportAsJSON();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `holographic-theme-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    app.showToast('Theme exported as JSON', 'success');
};

window.exportForWeb = function() {
    const app = window.holoApp;
    if (!app.engine) return;
    
    const options = {
        minified: document.getElementById('exportMinified').checked,
        responsive: document.getElementById('exportResponsive').checked,
        lowPower: document.getElementById('exportLowPower').checked
    };
    
    const embedCode = app.engine.exportForWeb(options);
    const blob = new Blob([embedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `holographic-embed-${Date.now()}.html`;
    link.click();
    
    URL.revokeObjectURL(url);
    app.showToast('Embed code exported', 'success');
};

window.exportWallpaper = function(width, height) {
    const app = window.holoApp;
    if (!app.engine) return;
    
    app.engine.exportWallpaper(width, height);
    app.showToast(`Wallpaper exported (${width}×${height})`, 'success');
};

window.prepareForMarketplace = function() {
    const app = window.holoApp;
    if (!app.engine) return;
    
    const themeName = document.getElementById('themeName').value;
    const authorName = document.getElementById('authorName').value;
    const description = document.getElementById('themeDescription').value;
    const price = document.getElementById('themePrice').value;
    
    if (!themeName || !authorName) {
        app.showToast('Please fill in theme name and author name', 'error');
        return;
    }
    
    const marketplacePackage = {
        theme: JSON.parse(app.engine.exportAsJSON()),
        metadata: {
            name: themeName,
            author: authorName,
            description: description,
            price: price ? parseFloat(price) : 0,
            created: new Date().toISOString(),
            version: '1.0'
        }
    };
    
    const jsonData = JSON.stringify(marketplacePackage, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `${themeName.toLowerCase().replace(/\s+/g, '-')}-marketplace.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    app.showToast('Marketplace package prepared', 'success');
};

// Quick toolbar functions
window.quickRandomize = function() {
    const app = window.holoApp;
    if (!app.engine) return;
    
    // Quick randomize - just a few key parameters
    app.engine.config.geometry.primary = Math.floor(Math.random() * 8);
    app.engine.config.colors.primaryHue = Math.floor(Math.random() * 360);
    app.engine.config.animation.baseSpeed = 0.5 + Math.random();
    
    app.updateAllControls();
    app.updateEngine();
};

window.quickColorShift = function() {
    const app = window.holoApp;
    if (!app.engine) return;
    
    app.engine.config.colors.primaryHue = (app.engine.config.colors.primaryHue + 60) % 360;
    app.engine.config.colors.secondaryHue = (app.engine.config.colors.secondaryHue + 60) % 360;
    
    app.updateColorControls();
    app.updateEngine();
};

window.quickGeometryChange = function() {
    const app = window.holoApp;
    if (!app.engine) return;
    
    app.engine.config.geometry.primary = (app.engine.config.geometry.primary + 1) % 8;
    
    app.updateGeometryControls();
    app.updateEngine();
};

window.quickSpeedToggle = function() {
    const app = window.holoApp;
    if (!app.engine) return;
    
    app.engine.config.animation.baseSpeed = app.engine.config.animation.baseSpeed > 1 ? 0.3 : 1.5;
    
    app.updateAnimationControls();
    app.updateEngine();
};

window.quickDensityToggle = function() {
    const app = window.holoApp;
    if (!app.engine) return;
    
    app.engine.config.geometry.density = app.engine.config.geometry.density > 1.5 ? 0.8 : 2.2;
    
    app.updateGeometryControls();
    app.updateEngine();
};

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.holoApp = new HolographicApp();
});

// Export for module use
export { HolographicApp };