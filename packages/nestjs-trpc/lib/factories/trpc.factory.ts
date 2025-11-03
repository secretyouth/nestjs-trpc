import { Inject, Injectable } from '@nestjs/common';
import { RouterFactory } from './router.factory';
import { TRPCRouter } from '../interfaces/factory.interface';
import { AnyRouter } from '@trpc/server';

@Injectable()
export class TRPCFactory {
  @Inject(RouterFactory)
  private readonly routerFactory!: RouterFactory;

  serializeAppRoutes(router: TRPCRouter, procedure: any): AnyRouter {
    const routerSchema = this.routerFactory.serializeRoutes(router, procedure);
    return router(routerSchema);
  }
}
