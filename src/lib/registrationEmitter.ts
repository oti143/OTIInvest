// Shared event emitter for registration updates across all components
type Listener = () => void;

class RegistrationEmitter {
  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    console.log(`✅ Listener added. Total listeners: ${this.listeners.size}`);
    return () => {
      this.listeners.delete(listener);
      console.log(`✅ Listener removed. Total listeners: ${this.listeners.size}`);
    };
  }

  emit() {
    console.log(`📢 Emitting update to ${this.listeners.size} listeners`);
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error("Error in listener:", err);
      }
    });
  }
}

export const registrationEmitter = new RegistrationEmitter();
