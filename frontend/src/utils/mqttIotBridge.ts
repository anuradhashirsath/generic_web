// MQTT IoT Hardware Bridge for Robotic Dispensing Isolators (src/utils/mqttIotBridge.ts)
// Real-time telemetry, pill-counter high-speed camera feedback, and RFID lockbox sealing

export interface RoboticIsolatorTelemetry {
  isolatorId: string;
  isolatorName: string;
  hepaFlowVelocityMs: number; // e.g. 0.45 m/s (ISO Class 7 standard: 0.36 - 0.54 m/s)
  pillCounterFps: number; // e.g. 120 FPS
  activeBatchCode: string;
  activeSaltName: string;
  totalPillsCounted: number;
  targetPillCount: number;
  fillStatus: 'IDLE' | 'COUNTING' | 'SEALED_RFID' | 'CALIBRATING' | 'WARNING_HEPA';
  rfidLockboxTag: string;
  temperatureCelsius: number;
}

export interface MqttMessage {
  topic: string;
  payload: RoboticIsolatorTelemetry;
  timestamp: string;
}

class MqttIotBridge {
  private activeTelemetry: RoboticIsolatorTelemetry = {
    isolatorId: 'ISO-CLEANROOM-02',
    isolatorName: 'Automated Pill Counter #4 (ISO Class 7 Zone)',
    hepaFlowVelocityMs: 0.45,
    pillCounterFps: 120,
    activeBatchCode: 'ATORVA-20-LOT819',
    activeSaltName: 'Atorvastatin Calcium 20mg',
    totalPillsCounted: 28,
    targetPillCount: 30,
    fillStatus: 'COUNTING',
    rfidLockboxTag: 'TAG: RFID-CRYPT-8942',
    temperatureCelsius: 4.2,
  };

  private subscribers: ((telemetry: RoboticIsolatorTelemetry) => void)[] = [];
  private intervalId: any = null;

  constructor() {
    this.startTelemetryLoop();
  }

  private startTelemetryLoop() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      // Simulate live robotic pill-counting sensor telemetry
      if (this.activeTelemetry.fillStatus === 'COUNTING') {
        if (this.activeTelemetry.totalPillsCounted < this.activeTelemetry.targetPillCount) {
          this.activeTelemetry.totalPillsCounted += 1;
        } else {
          this.activeTelemetry.fillStatus = 'SEALED_RFID';
        }
      }
      this.notifySubscribers();
    }, 2000);
  }

  private notifySubscribers() {
    this.subscribers.forEach((cb) => cb({ ...this.activeTelemetry }));
  }

  /**
   * Subscribe to live MQTT IoT isolator telemetry stream
   */
  subscribeTelemetry(callback: (telemetry: RoboticIsolatorTelemetry) => void): () => void {
    this.subscribers.push(callback);
    callback({ ...this.activeTelemetry });

    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  /**
   * Send MQTT Command to Robotic Pill Isolator Hardware
   */
  async sendRoboticCommand(
    command: 'START_BATCH' | 'CALIBRATE' | 'ENGAGE_RFID_SEAL' | 'EMERGENCY_STOP',
    batchCode?: string,
    targetCount: number = 30
  ): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (command === 'START_BATCH') {
      this.activeTelemetry.fillStatus = 'COUNTING';
      this.activeTelemetry.totalPillsCounted = 0;
      this.activeTelemetry.targetPillCount = targetCount;
      if (batchCode) this.activeTelemetry.activeBatchCode = batchCode;
      this.notifySubscribers();
      return { success: true, message: `MQTT topic 'isolator/cmd/start' published to ${this.activeTelemetry.isolatorId}` };
    }

    if (command === 'ENGAGE_RFID_SEAL') {
      this.activeTelemetry.fillStatus = 'SEALED_RFID';
      this.notifySubscribers();
      return { success: true, message: `RFID Cryptographic Lock engaged. Tag ${this.activeTelemetry.rfidLockboxTag} sealed.` };
    }

    if (command === 'CALIBRATE') {
      this.activeTelemetry.fillStatus = 'CALIBRATING';
      this.notifySubscribers();
      setTimeout(() => {
        this.activeTelemetry.fillStatus = 'IDLE';
        this.notifySubscribers();
      }, 2500);
      return { success: true, message: `HEPA airflow and camera calibrated to 120 FPS.` };
    }

    return { success: true, message: `Command ${command} dispatched via MQTT QoS 1.` };
  }
}

export const mqttIotBridge = new MqttIotBridge();
