import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const rootEnv = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../.env')
].find(p => fs.existsSync(p));

if (rootEnv) {
  dotenv.config({ path: rootEnv });
}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false
    })
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger OpenAPI Setup
  const config = new DocumentBuilder()
    .setTitle('SentinelX API')
    .setDescription('AI-Powered Intelligent Assistant for Indian Standards and Bureau of Indian Standards (BIS) Services')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentication')
    .addTag('Indian Standards')
    .addTag('Certification')
    .addTag('Testing Requirements')
    .addTag('Laboratories')
    .addTag('Hallmarking')
    .addTag('Consumer Protection')
    .addTag('Chat & AI Assistant')
    .addTag('RAG Retrieval')
    .addTag('Compliance Reports')
    .addTag('Analytics')
    .addTag('Admin')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 SentinelX API running on http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger documentation available at http://localhost:${port}/api/docs`);

  // Log detected LLM Configuration
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const mistralKey = process.env.MISTRAL_API_KEY;

  console.log('--------------------------------------------------');
  console.log(`[LLM Status] Configured Provider: ${process.env.LLM_PROVIDER || '(auto-detect)'}`);
  if (openrouterKey && !openrouterKey.includes('your_openrouter_key')) {
    console.log(`[LLM Status] \x1b[32m✔ OpenRouter Connected\x1b[0m | Model: ${process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free'}`);
  } else if (openaiKey && !openaiKey.includes('your_openai_api_key_here')) {
    console.log(`[LLM Status] \x1b[32m✔ OpenAI Connected\x1b[0m | Model: ${process.env.OPENAI_MODEL || 'gpt-4o-mini'}`);
  } else if (geminiKey && !geminiKey.includes('your_')) {
    console.log(`[LLM Status] \x1b[32m✔ Google Gemini Connected\x1b[0m | Model: ${process.env.LLM_MODEL || 'gemini-1.5-flash'}`);
  } else if (anthropicKey && !anthropicKey.includes('your_anthropic_api_key_here')) {
    console.log(`[LLM Status] \x1b[32m✔ Anthropic Connected\x1b[0m | Model: ${process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022'}`);
  } else if (mistralKey && !mistralKey.includes('your_')) {
    console.log(`[LLM Status] \x1b[32m✔ Mistral Connected\x1b[0m | Model: ${process.env.MISTRAL_MODEL || 'mistral-large-latest'}`);
  } else {
    console.log(`[LLM Status] \x1b[33m⚠ No Cloud LLM Keys Detected\x1b[0m | Using 100% Free Offline Deterministic Grounding Engine`);
  }
  console.log('--------------------------------------------------');
}

bootstrap();
