import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      app: process.env.APP_NAME,
      apiVersion: process.env.npm_package_version,
      environment: process.env.NODE_ENV,
      commitSHA: process.env.GIT_SHA,
      branch: process.env.GIT_BRANCH,
    };
  }
  getOrigins(): any {
    return [
      'http://localhost:3000',
      'https://meuben.thp.org.br',
      'http://localhost:3001',
      'https://purple-tree-056a6850f.5.azurestaticapps.net',
      'http://localhost:5174',
      '*',
    ];
  }
}
