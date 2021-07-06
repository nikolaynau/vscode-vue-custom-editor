export class RunOnceScheduler {
  protected runner: ((...args: any[]) => void) | null;

  private timeoutToken: any;
  private timeout: number;
  private timeoutHandler: () => void;

  constructor(runner: (...args: any[]) => void, delay: number) {
    this.timeoutToken = -1;
    this.runner = runner;
    this.timeout = delay;
    this.timeoutHandler = this.onTimeout.bind(this);
  }

  dispose(): void {
    this.cancel();
    this.runner = null;
  }

  cancel(): void {
    if (this.isScheduled()) {
      clearTimeout(this.timeoutToken);
      this.timeoutToken = -1;
    }
  }

  schedule(delay = this.timeout): void {
    this.cancel();
    this.timeoutToken = setTimeout(this.timeoutHandler, delay);
  }

  get delay(): number {
    return this.timeout;
  }

  set delay(value: number) {
    this.timeout = value;
  }

  isScheduled(): boolean {
    return this.timeoutToken !== -1;
  }

  private onTimeout() {
    this.timeoutToken = -1;
    if (this.runner) {
      this.doRun();
    }
  }

  protected doRun(): void {
    if (this.runner) {
      this.runner();
    }
  }
}
