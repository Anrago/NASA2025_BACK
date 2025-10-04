import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { HistoricalModule } from './historical/historical.module';
import { MessagesModule } from './messages/messages.module';
import { VertexAIModule } from './vertexai/vertex-ai.module';

@Module({
  imports: [
    VertexAIModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('CONNECTION_STRING'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    HistoricalModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
