import { Subscription } from '../subscription.decorator';
import { PROCEDURE_METADATA_KEY, PROCEDURE_TYPE_KEY } from '../../trpc.constants';
import { ProcedureType } from '../../trpc.enum';
import { z } from 'zod';

describe('Subscription', () => {
  it('should set the procedure type metadata to Subscription', () => {
    class TestRouter {
      @Subscription()
      testSubscription() {
        return async function* () {
          yield { data: 'test' };
        };
      }
    }

    const router = new TestRouter();
    const metadata = Reflect.getMetadata(
      PROCEDURE_TYPE_KEY,
      router.testSubscription,
    );

    expect(metadata).toBe(ProcedureType.Subscription);
  });

  it('should set procedure metadata with input schema', () => {
    const inputSchema = z.object({ id: z.string() });

    class TestRouter {
      @Subscription({ input: inputSchema })
      testSubscription() {
        return async function* () {
          yield { data: 'test' };
        };
      }
    }

    const router = new TestRouter();
    const metadata = Reflect.getMetadata(
      PROCEDURE_METADATA_KEY,
      router.testSubscription,
    );

    expect(metadata).toBeDefined();
    expect(metadata.input).toBe(inputSchema);
  });

  it('should set procedure metadata with output schema', () => {
    const outputSchema = z.object({ data: z.string() });

    class TestRouter {
      @Subscription({ output: outputSchema })
      testSubscription() {
        return async function* () {
          yield { data: 'test' };
        };
      }
    }

    const router = new TestRouter();
    const metadata = Reflect.getMetadata(
      PROCEDURE_METADATA_KEY,
      router.testSubscription,
    );

    expect(metadata).toBeDefined();
    expect(metadata.output).toBe(outputSchema);
  });

  it('should set procedure metadata with both input and output schemas', () => {
    const inputSchema = z.object({ id: z.string() });
    const outputSchema = z.object({ data: z.string() });

    class TestRouter {
      @Subscription({ input: inputSchema, output: outputSchema })
      testSubscription() {
        return async function* () {
          yield { data: 'test' };
        };
      }
    }

    const router = new TestRouter();
    const metadata = Reflect.getMetadata(
      PROCEDURE_METADATA_KEY,
      router.testSubscription,
    );

    expect(metadata).toBeDefined();
    expect(metadata.input).toBe(inputSchema);
    expect(metadata.output).toBe(outputSchema);
  });

  it('should work without any arguments', () => {
    class TestRouter {
      @Subscription()
      testSubscription() {
        return async function* () {
          yield { data: 'test' };
        };
      }
    }

    const router = new TestRouter();
    const typeMetadata = Reflect.getMetadata(
      PROCEDURE_TYPE_KEY,
      router.testSubscription,
    );
    const procedureMetadata = Reflect.getMetadata(
      PROCEDURE_METADATA_KEY,
      router.testSubscription,
    );

    expect(typeMetadata).toBe(ProcedureType.Subscription);
    expect(procedureMetadata).toBeUndefined();
  });
});
