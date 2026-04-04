export class HermesConnectionError extends Error {
  constructor(message = 'Unable to reach Hermes runtime.') {
    super(message);
    this.name = 'HermesConnectionError';
  }
}

export class HermesResponseError extends Error {
  constructor(
    public status: number,
    message = 'Hermes runtime returned an unexpected response.',
  ) {
    super(message);
    this.name = 'HermesResponseError';
  }
}
