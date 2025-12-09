import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class CollaborationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // Track active users per room (document ID)
    private activeUsers: Record<string, string[]> = {};

    handleConnection(client: Socket) {
        // console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        // console.log(`Client disconnected: ${client.id}`);
        // Cleanup logic would go here
    }

    @SubscribeMessage('join-document')
    handleJoinDocument(
        @MessageBody() data: { documentId: string; userId: string; userName: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.join(data.documentId);

        if (!this.activeUsers[data.documentId]) {
            this.activeUsers[data.documentId] = [];
        }
        this.activeUsers[data.documentId].push(data.userName);

        this.server.to(data.documentId).emit('user-joined', {
            userId: data.userId,
            userName: data.userName,
            activeUsers: this.activeUsers[data.documentId]
        });

        return { event: 'joined', success: true };
    }

    @SubscribeMessage('leave-document')
    handleLeaveDocument(
        @MessageBody() data: { documentId: string; userId: string; userName: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.leave(data.documentId);

        if (this.activeUsers[data.documentId]) {
            this.activeUsers[data.documentId] = this.activeUsers[data.documentId].filter(u => u !== data.userName);
        }

        this.server.to(data.documentId).emit('user-left', {
            userId: data.userId,
            userName: data.userName,
            activeUsers: this.activeUsers[data.documentId]
        });
    }

    @SubscribeMessage('edit-document')
    handleEditDocument(
        @MessageBody() data: { documentId: string; change: any; userId: string },
        @ConnectedSocket() client: Socket,
    ) {
        // Broadcast change to everyone else in the room
        client.to(data.documentId).emit('document-changed', {
            change: data.change,
            userId: data.userId
        });
    }

    @SubscribeMessage('cursor-move')
    handleCursorMove(
        @MessageBody() data: { documentId: string; position: any; userId: string; userName: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.to(data.documentId).emit('cursor-updated', data);
    }
}
