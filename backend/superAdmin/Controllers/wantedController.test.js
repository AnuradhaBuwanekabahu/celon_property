import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeWantedPayload } from './wantedController.js';

test('normalizes legacy wanted form names to the API schema', () => {
  const payload = normalizeWantedPayload({
    client_id: 7,
    title: 'Need a house',
    Phone_number: '0771234567',
    Preferred_city: 'Colombo',
    main_image: 'image.jpg',
    status: 'active'
  });

  assert.equal(payload.phone_number, '0771234567');
  assert.equal(payload.preferred_city, 'Colombo');
  assert.equal(payload.status, 'active');
});

test('keeps explicit snake_case values when present', () => {
  const payload = normalizeWantedPayload({
    client_id: 8,
    title: 'Need land',
    phone_number: '0719876543',
    preferred_city: 'Kandy',
    budget: 5000000,
    description: 'Close to town'
  });

  assert.equal(payload.phone_number, '0719876543');
  assert.equal(payload.preferred_city, 'Kandy');
  assert.equal(payload.budget, 5000000);
});
