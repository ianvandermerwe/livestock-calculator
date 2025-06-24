// Livestock Weight Calculator PWA
class LivestockCalculator {
    constructor() {
        this.currentAnimal = { animal: 'pig', coefficient: 400 };
        this.measurements = this.loadMeasurements();
        this.deferredPrompt = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateHistoryCount();
        this.checkInstallPrompt();
        this.registerServiceWorker();
    }

    bindEvents() {
        // Animal selection
        document.querySelectorAll('.animal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectAnimal(e));
        });

        // Calculate button
        document.getElementById('calculateBtn').addEventListener('click', () => this.calculateWeight());

        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => this.clearInputs());

        // Navigation tabs
        document.getElementById('calculatorTabBtn').addEventListener('click', () => this.showCalculator());
        document.getElementById('historyTabBtn').addEventListener('click', () => this.showHistory());

        // Clear history
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());

        // Help modal
        document.getElementById('helpBtn').addEventListener('click', () => this.showInstructions());
        document.querySelector('.close').addEventListener('click', () => this.hideInstructions());

        // Install prompt
        document.getElementById('installBtn').addEventListener('click', () => this.installApp());
        document.getElementById('dismissInstallBtn').addEventListener('click', () => this.dismissInstallPrompt());

        // Enter key on inputs
        document.getElementById('heartGirth').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calculateWeight();
        });
        document.getElementById('length').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calculateWeight();
        });

        // PWA install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('instructionsModal');
            if (e.target === modal) {
                this.hideInstructions();
            }
        });
    }

    selectAnimal(e) {
        // Remove active class from all buttons
        document.querySelectorAll('.animal-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to clicked button
        e.target.classList.add('active');

        // Update current animal
        this.currentAnimal = {
            animal: e.target.dataset.animal,
            coefficient: parseInt(e.target.dataset.coefficient)
        };
    }

    calculateWeight() {
        const heartGirth = parseFloat(document.getElementById('heartGirth').value);
        const length = parseFloat(document.getElementById('length').value);

        // Validation
        if (!heartGirth || !length || heartGirth <= 0 || length <= 0) {
            this.showAlert('Please enter valid positive numbers for both measurements.');
            return;
        }

        // Calculate weight using formula: (Heart Girth)² × Length ÷ Coefficient
        // Convert from pounds to kilograms (1 pound = 0.453592 kg)
        const weightInPounds = (heartGirth * heartGirth * length) / this.currentAnimal.coefficient;
        const weight = weightInPounds * 0.453592;
        const roundedWeight = Math.round(weight * 100) / 100;

        // Display result
        this.displayResult(roundedWeight);

        // Save measurement
        this.saveMeasurement({
            id: Date.now().toString(),
            animal: this.currentAnimal.animal,
            heartGirth: heartGirth,
            length: length,
            weight: roundedWeight,
            coefficient: this.currentAnimal.coefficient,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        });
    }

    displayResult(weight) {
        const resultElement = document.getElementById('result');
        const weightElement = document.getElementById('weightResult');
        const animalElement = document.getElementById('animalResult');

        weightElement.textContent = weight;
        animalElement.textContent = this.capitalizeFirst(this.currentAnimal.animal);
        
        resultElement.style.display = 'block';
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    clearInputs() {
        document.getElementById('heartGirth').value = '';
        document.getElementById('length').value = '';
        document.getElementById('result').style.display = 'none';
    }

    saveMeasurement(measurement) {
        this.measurements.unshift(measurement);
        localStorage.setItem('livestock_measurements', JSON.stringify(this.measurements));
        this.updateHistoryCount();
    }

    loadMeasurements() {
        try {
            const saved = localStorage.getItem('livestock_measurements');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading measurements:', error);
            return [];
        }
    }

    updateHistoryCount() {
        document.getElementById('historyCount').textContent = this.measurements.length;
    }

    showCalculator() {
        document.getElementById('calculator-section').style.display = 'block';
        document.getElementById('history-section').style.display = 'none';
        
        document.getElementById('calculatorTabBtn').classList.add('active');
        document.getElementById('historyTabBtn').classList.remove('active');
    }

    showHistory() {
        document.getElementById('calculator-section').style.display = 'none';
        document.getElementById('history-section').style.display = 'block';
        
        document.getElementById('calculatorTabBtn').classList.remove('active');
        document.getElementById('historyTabBtn').classList.add('active');
        
        this.renderHistory();
    }

    renderHistory() {
        const historyList = document.getElementById('historyList');
        
        if (this.measurements.length === 0) {
            historyList.innerHTML = '<p class="no-data">No measurements saved yet</p>';
            return;
        }

        const historyHTML = this.measurements.map(measurement => `
            <div class="history-item">
                <div class="history-info">
                    <div class="history-weight">${this.capitalizeFirst(measurement.animal)} - ${measurement.weight} kg</div>
                    <div class="history-details">Girth: ${measurement.heartGirth}cm | Length: ${measurement.length}cm</div>
                    <div class="history-date">${measurement.date} at ${measurement.time}</div>
                </div>
                <button class="delete-btn" onclick="calculator.deleteMeasurement('${measurement.id}')">×</button>
            </div>
        `).join('');

        historyList.innerHTML = historyHTML;
    }

    deleteMeasurement(id) {
        this.measurements = this.measurements.filter(m => m.id !== id);
        localStorage.setItem('livestock_measurements', JSON.stringify(this.measurements));
        this.updateHistoryCount();
        this.renderHistory();
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all measurement history?')) {
            this.measurements = [];
            localStorage.removeItem('livestock_measurements');
            this.updateHistoryCount();
            this.renderHistory();
        }
    }

    showInstructions() {
        document.getElementById('instructionsModal').style.display = 'block';
    }

    hideInstructions() {
        document.getElementById('instructionsModal').style.display = 'none';
    }

    showInstallPrompt() {
        document.getElementById('installPrompt').style.display = 'flex';
    }

    dismissInstallPrompt() {
        document.getElementById('installPrompt').style.display = 'none';
    }

    async installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            this.deferredPrompt = null;
        }
        this.dismissInstallPrompt();
    }

    checkInstallPrompt() {
        // Show install prompt after 30 seconds if not dismissed
        setTimeout(() => {
            const prompt = document.getElementById('installPrompt');
            if (window.matchMedia('(display-mode: browser)').matches && prompt.style.display === 'none') {
                this.showInstallPrompt();
            }
        }, 30000);
    }

    showAlert(message) {
        alert(message);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                console.log('ServiceWorker registered successfully:', registration.scope);
            } catch (error) {
                console.log('ServiceWorker registration failed:', error);
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new LivestockCalculator();
});

// Handle app installation state
window.addEventListener('appinstalled', () => {
    console.log('App was installed');
    document.getElementById('installPrompt').style.display = 'none';
});

// Handle offline/online status
window.addEventListener('online', () => {
    console.log('App is online');
});

window.addEventListener('offline', () => {
    console.log('App is offline');
});
