# Upgrade to tRPC v11

This document outlines the changes made to upgrade nestjs-trpc to support tRPC v11.

## Summary of Changes

The nestjs-trpc package has been successfully upgraded to support tRPC v11 while maintaining backward compatibility with the existing API. The main focus of this upgrade was to:

1. Update peer dependencies to support `@trpc/server@^11.0.0`
2. Add support for subscriptions (a key feature in tRPC v11)
3. Update internal type definitions to work with v11's API changes
4. Ensure all tests pass with the new version

## What's New

### Subscription Support

tRPC v11 introduces improved subscription support using async generators. The nestjs-trpc adapter now fully supports this feature.

#### New `@Subscription()` Decorator

You can now create subscription procedures that stream real-time data to clients:

```typescript
import { Router, Subscription, Input } from 'nestjs-trpc';
import { z } from 'zod';
import { EventEmitter, on } from 'events';

const ee = new EventEmitter();

@Router()
export class NotificationRouter {
  @Subscription({
    input: z.object({
      userId: z.string(),
    }),
  })
  async *onNotification(
    @Input('userId') userId: string,
    @Options() opts: ProcedureOptions,
  ) {
    // Listen for new events
    for await (const [data] of on(ee, 'notification', {
      signal: opts.signal, // Automatically cancels when client disconnects
    })) {
      if (data.userId === userId) {
        yield data;
      }
    }
  }
}
```

Subscriptions work with both WebSockets and Server-Sent Events (SSE). See [tRPC's subscription documentation](https://trpc.io/docs/subscriptions) for more details on client-side setup.

## Breaking Changes

### Internal Type Changes

The following internal types have been updated to work with tRPC v11:

- `ProcedureBuilder` is no longer exported from `@trpc/server`
- `ProcedureParams` has been removed
- `ProcedureRouterRecord` has been removed
- Internal paths like `@trpc/server/dist/core/*` are no longer used

These changes should not affect end users unless you were directly importing internal types.

### Test Updates

One test assertion was updated to reflect v11's internal structure changes:
- `_def.query` property check replaced with `_def.type` check

## Peer Dependencies

Updated peer dependency:

```json
{
  "@trpc/server": "^11.0.0"
}
```

## Migration Guide

If you're upgrading an existing nestjs-trpc application:

1. **Update dependencies:**
   ```bash
   npm install @trpc/server@^11 nestjs-trpc@latest
   # or
   yarn add @trpc/server@^11 nestjs-trpc@latest
   ```

2. **No code changes required for existing Query and Mutation procedures** - they continue to work as before.

3. **Add subscriptions (optional):**
   - Import the new `@Subscription()` decorator
   - Create async generator functions for real-time streaming
   - Configure your client to use `httpSubscriptionLink` or `wsLink`

4. **Update transformers if used:**
   If you use data transformers (like superjson), note that in tRPC v11, transformers are configured in your client links rather than in the `initTRPC.create()` call. However, nestjs-trpc still accepts the `transformer` option in the module configuration for backward compatibility.

## Example: Adding Subscriptions

Here's a complete example of adding real-time subscriptions to your NestJS application:

```typescript
// notification.router.ts
import { Router, Subscription, Input, Options, ProcedureOptions } from 'nestjs-trpc';
import { z } from 'zod';
import { tracked } from '@trpc/server';
import { EventEmitter, on } from 'events';

const notificationEmitter = new EventEmitter();

@Router()
export class NotificationRouter {
  @Subscription({
    input: z.object({
      lastEventId: z.string().optional(),
    }),
  })
  async *onMessage(
    @Input() input: { lastEventId?: string },
    @Options() opts: ProcedureOptions,
  ) {
    // If client reconnects, you can catch them up using lastEventId
    if (input.lastEventId) {
      // Fetch missed messages from database
      const missedMessages = await this.fetchMessagesSince(input.lastEventId);
      for (const msg of missedMessages) {
        yield tracked(msg.id, msg);
      }
    }

    // Stream new messages
    for await (const [data] of on(notificationEmitter, 'message', {
      signal: opts.signal,
    })) {
      // The tracked() helper enables automatic reconnection with last known ID
      yield tracked(data.id, data);
    }
  }
}
```

## Resources

- [tRPC v11 Migration Guide](https://trpc.io/docs/migrate-from-v10-to-v11)
- [tRPC Subscriptions Documentation](https://trpc.io/docs/subscriptions)
- [nestjs-trpc Documentation](https://nestjs-trpc.io)

## Testing

All existing tests pass with tRPC v11. The test suite includes:
- ✅ Decorator tests (Query, Mutation, Subscription)
- ✅ Factory tests (procedure, middleware, router)
- ✅ Generator tests
- ✅ Scanner tests

Run tests with:
```bash
yarn test
```

## Compatibility

- **Node.js:** 18 || 19 || 20 (as required by tRPC v11)
- **TypeScript:** >=5.7.2 (as required by tRPC v11)
- **NestJS:** ^9.3.8 || ^10.0.0
- **tRPC:** ^11.0.0

## Notes

- Subscriptions require appropriate transport configuration (WebSocket server or SSE support)
- The `signal` parameter in `ProcedureOptions` is crucial for proper cleanup when clients disconnect
- Use `tracked()` helper from `@trpc/server` for automatic reconnection support