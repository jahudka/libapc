declare module 'midi' {
  export declare type Message = number[];

  export declare class Input {
    getPortCount(): number;
    getPortName(port: number): string;
    openPort(port: number): void;
    openVirtualPort(name: string): void;
    isPortOpen(): boolean;
    closePort(): void;
    ignoreTypes(sysex: boolean, timing: boolean, activeSensing: boolean): void;
    on(event: 'message', handler: (deltaTime: number, message: Message) => void): void;
  }

  export declare class Output {
    getPortCount(): number;
    getPortName(port: number): string;
    openPort(port: number): void;
    openVirtualPort(name: string): void;
    isPortOpen(): boolean;
    closePort(): void;
    send(message: Message): void;
  }
}
