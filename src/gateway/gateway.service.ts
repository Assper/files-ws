import { Injectable } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { createWriteStream, WriteStream } from 'fs';
import { join } from 'path';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({ transports: ['websocket'], maxHttpBufferSize: 1e7 }) // 10MB max buffer size for request
export class GatewayService {
  @WebSocketServer()
  server: Server;

  private streams = new Map<string, WriteStream>();

  handleConnection() {
    console.log('CONNECTED');
  }

  async handleDisconnect() {
    console.log('DISCONNECTED');
  }

  private uploadFile(
    filePath: string,
    total: number,
    chunk: ArrayBuffer,
  ): Promise<{ status: 'success' | 'progress' | 'failed' }> {
    return new Promise((resolve) => {
      if (this.streams.has(filePath)) {
        const stream = this.streams.get(filePath);
        stream.write(chunk, (err) => {
          console.error(err);
          if (err) resolve({ status: 'failed' });
          else resolve({ status: 'progress' });
        });
      } else {
        const stream = createWriteStream(
          join(process.cwd(), 'upload', filePath),
        );

        this.streams.set(filePath, stream);

        stream.on('open', () => {
          console.log('Stream open ...  0.00%');
          resolve({ status: 'progress' });
        });

        stream.on('drain', () => {
          const written = stream.bytesWritten;
          const pWritten = ((written / total) * 100).toFixed(2);
          console.log(`Processing  ...  ${pWritten}% done`);
          console.log(written, total);
          if (written >= total) stream.close();
        });

        stream.on('close', () => {
          console.log('Processing  ...  100%');
          this.streams.delete(filePath);
        });

        stream.write(chunk, (err) => {
          console.error(err);
          if (err) resolve({ status: 'failed' });
          else resolve({ status: 'progress' });
        });
      }
    });
  }

  @SubscribeMessage('file-transfer')
  async handleEvent(
    @MessageBody('chunk') chunk: any,
    @MessageBody('total') total: number,
    @MessageBody('filePath') filePath: string,
  ): Promise<{ status: 'success' | 'progress' | 'failed' }> {
    const result = await this.uploadFile(filePath, total, chunk);
    this.server.sockets.emit('file-transfer', result);
    return result;
  }
}
