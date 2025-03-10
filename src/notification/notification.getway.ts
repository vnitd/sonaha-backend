// import {
//   WebSocketGateway,
//   SubscribeMessage,
//   MessageBody,
//   WsResponse,
// } from '@nestjs/websockets';
// import { Socket } from 'socket.io';
// import { PrismaClient } from '@prisma/client';

// @WebSocketGateway()
// export class NotificationGateway {
//   private activeConnections: { [key: string]: Socket } = {};
//   prisma = new PrismaClient(); // Khởi tạo PrismaClient để truy vấn cơ sở dữ liệu

//   @SubscribeMessage('comment')
//   async handleComment(
//     @MessageBody()
//     commentData: {
//       userId: string;
//       postId: string;
//       comment: string;
//     },
//   ): Promise<WsResponse<string>> {
//     // ý là cái userId mình không dùng nhma có cách nào để giả bộ dùng nó k
//     const {
//       // userId,
//       postId,
//       comment,
//     } = commentData;

//     await this.sendNotificationToAdminsAndModerators(postId, comment);

//     return {
//       event: 'commentNotification',
//       data: `New comment on post ${postId}`,
//     };
//   }

//   private async sendNotificationToAdminsAndModerators(
//     postId: string,
//     comment: string,
//   ): Promise<void> {
//     const adminsAndModerators = await this.prisma.transactions.findMany({
//       where: {
//         property_id: Number(postId),
//         status: 'pending',
//       },
//       select: {
//         users_transactions_moderator_idTousers: {
//           select: { user_id: true, role_name: true },
//         },
//       },
//     });
//     adminsAndModerators.forEach((propertyManager) => {
//       if (
//         Array.isArray(propertyManager.users_transactions_moderator_idTousers)
//       ) {
//         propertyManager.users_transactions_moderator_idTousers.forEach(
//           (manager) => {
//             Object.values(this.activeConnections).forEach((socket) => {
//               if (socket.data.userId === manager.user_id) {
//                 socket.emit('newComment', { postId, comment });
//               }
//             });
//           },
//         );
//       } else {
//         const manager = propertyManager.users_transactions_moderator_idTousers;
//         Object.values(this.activeConnections).forEach((socket) => {
//           if (socket.data.userId === manager.user_id) {
//             socket.emit('newComment', { postId, comment });
//           }
//         });
//       }
//     });
//   }

//   handleConnection(client: Socket) {
//     console.log('New client connected');
//     client.data.userId = 'userId_from_auth';
//     this.activeConnections[client.id] = client;
//   }

//   handleDisconnect(client: Socket) {
//     // Khi một client ngắt kết nối, xóa socket khỏi activeConnections
//     console.log('Client disconnected');
//     delete this.activeConnections[client.id];
//   }
// }
