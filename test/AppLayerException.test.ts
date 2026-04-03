import AppLayerException, {
  executeAsyncWithLayerException,
  executeWithLayerException,
} from '@/exceptions/AppLayerException';
import ValidationException from '@/exceptions/ValidationException';
import { captureErrorSilently } from '@/utils/loggingUtil';

jest.mock('@/utils/loggingUtil', () => ({
  captureErrorSilently: jest.fn().mockResolvedValue(undefined),
}));

class SampleLayerException extends AppLayerException {}

describe('AppLayerException helpers', () => {
  const mockCaptureErrorSilently = captureErrorSilently as jest.MockedFunction<typeof captureErrorSilently>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('wraps sync errors with the provided exception type', () => {
    expect(() =>
      executeWithLayerException(() => {
        throw new Error('sync failed');
      }, SampleLayerException)
    ).toThrow(SampleLayerException);
  });

  it('returns sync operation result when no error occurs', () => {
    const result = executeWithLayerException(() => 10, SampleLayerException);

    expect(result).toBe(10);
  });

  it('wraps async errors with the provided exception type', async () => {
    await expect(
      executeAsyncWithLayerException(async () => {
        throw new Error('async failed');
      }, SampleLayerException)
    ).rejects.toThrow(SampleLayerException);
  });

  it('uses mapped exception when mapper returns one', async () => {
    await expect(
      executeAsyncWithLayerException(
        async () => {
          throw new Error('mapped');
        },
        SampleLayerException,
        (error) => new SampleLayerException(`wrapped: ${String(error)}`)
      )
    ).rejects.toThrow('wrapped: Error: mapped');
  });

  it('does not log user input validation errors', () => {
    const error = new ValidationException('campo invalido', 'user_input');

    expect(() =>
      executeWithLayerException(() => {
        throw error;
      }, SampleLayerException)
    ).toThrow(SampleLayerException);

    expect(mockCaptureErrorSilently).not.toHaveBeenCalled();
  });

  it('still logs api contract validation errors', () => {
    const error = new ValidationException('response invalida', 'api_contract');

    expect(() =>
      executeWithLayerException(() => {
        throw error;
      }, SampleLayerException)
    ).toThrow(SampleLayerException);

    expect(mockCaptureErrorSilently).toHaveBeenCalledWith({ error });
  });
});
