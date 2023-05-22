import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { makePaymentSessionResolve } from '../../../../src/services/shopify/payment-session-resolve.service';
import { ResolvePaymentResponse } from '../../../../src/models/shopify-graphql-responses/resolve-payment-response.model';

describe('unit testing payment session resolve', () => {
    it('valid response', async () => {
        let mock = new MockAdapter(axios);
        mock.onPost().reply(200, {
            data: {
                paymentSessionResolve: {
                    paymentSession: {
                        id: 'mock-id',
                        state: {
                            code: 'SUCCESS',
                        },
                        nextAction: { action: 'redirect', context: { redirectUrl: 'https://example.com' } },
                    },
                    userErrors: [],
                },
            },
            extensions: {},
        });
        const mockPaymentSessionResolve = makePaymentSessionResolve(axios);

        await expect(
            mockPaymentSessionResolve('mock-id', 'mock-shop.shopify.com', 'mock-token')
        ).resolves.not.toThrow();
    });

    it('invalid response, missing id', async () => {
        let mock = new MockAdapter(axios);
        mock.onPost().reply(200, {
            data: {
                paymentSessionResolve: {
                    paymentSession: {
                        state: {
                            code: 'SUCCESS',
                        },
                        nextAction: { action: 'redirect', context: { redirectUrl: 'https://example.com' } },
                    },
                    userErrors: [],
                },
            },
            extensions: {},
        });
        const mockPaymentSessionResolve = makePaymentSessionResolve(axios);

        await expect(mockPaymentSessionResolve('mock-id', 'mock-shop.shopify.com', 'mock-token')).rejects.toThrow();
    });
});