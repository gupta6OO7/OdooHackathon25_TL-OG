// Type definitions for the application

export type Environment = 'development' | 'production' | 'test';

export type SortOrder = 'ASC' | 'DESC';

export type DatabaseConnectionType = 'postgres' | 'mysql' | 'sqlite';

export type UserRole = 'admin' | 'user' | 'moderator';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
