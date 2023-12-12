import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (): Promise<DataSource> => {
      const dataSource = new DataSource({
        type: 'sqlite',
        database: 'my-image-sns.db',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        // logging: true,
      });

      return dataSource.initialize();
    },
  },
];
