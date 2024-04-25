const teste = {
  "id": 1322787973,
  "date_created": "2024-04-24T13:35:27.562-04:00",
  "date_approved": "2024-04-24T13:35:27.805-04:00",
  "date_last_updated": "2024-04-24T13:35:27.805-04:00",
  "date_of_expiration": null,
  "money_release_date": "2024-04-24T13:35:27.805-04:00",
  "money_release_status": "released",
  "operation_type": "regular_payment",
  "issuer_id": "24",
  "payment_method_id": "master",
  "payment_type_id": "credit_card",
  "payment_method": {
      "id": "master",
      "type": "credit_card",
      "issuer_id": "24",
      "data": {
          "routing_data": {
              "merchant_account_id": "60272716"
          }
      }
  },
  "status": "approved",
  "status_detail": "accredited",
  "currency_id": "BRL",
  "description": null,
  "live_mode": false,
  "sponsor_id": null,
  "authorization_code": "229549003",
  "money_release_schema": null,
  "taxes_amount": 0,
  "counter_currency": null,
  "brand_id": null,
  "shipping_amount": 0,
  "build_version": "3.49.0",
  "pos_id": null,
  "store_id": null,
  "integrator_id": null,
  "platform_id": null,
  "corporation_id": null,
  "payer": {
      "identification": {
          "number": "32659430",
          "type": "DNI"
      },
      "entity_type": null,
      "phone": {
          "number": null,
          "extension": null,
          "area_code": null
      },
      "last_name": null,
      "id": "1233994499",
      "type": null,
      "first_name": null,
      "email": "test_user_80507629@testuser.com"
  },
  "collector_id": 59058162,
  "marketplace_owner": null,
  "metadata": {},
  "additional_info": {
      "items": [
          {
              "id": "1",
              "title": "Xícara Túmulo dos Vagalumes",
              "description": "Xìcara baseada na animação Túmulo dos Vagalumes da produtora Studio Ghibli.",
              "picture_url": "https://i.imgur.com/5yxGTSb.jpeg",
              "category_id": "Ceramics",
              "quantity": "1",
              "unit_price": "80"
          }
      ],
      "payer": {
          "address": {
              "street_number": "166"
          },
          "first_name": "Victor"
      },
      "shipments": {
          "receiver_address": {
              "zip_code": "03366070",
              "state_name": "SP",
              "city_name": "São Paulo",
              "street_name": "Rua Banharão",
              "street_number": "166"
          }
      },
      "available_balance": null,
      "nsu_processadora": null,
      "authentication_code": null
  },
  "order": {},
  "external_reference": null,
  "transaction_amount": 102,
  "transaction_amount_refunded": 0,
  "coupon_amount": 0,
  "differential_pricing_id": null,
  "financing_group": null,
  "deduction_schema": null,
  "installments": 4,
  "transaction_details": {
      "payment_method_reference_id": null,
      "acquirer_reference": null,
      "net_received_amount": 96.92,
      "total_paid_amount": 113.08,
      "overpaid_amount": 0,
      "external_resource_url": null,
      "installment_amount": 28.27,
      "financial_institution": null,
      "payable_deferral_period": null
  },
  "fee_details": [
      {
          "type": "financing_fee",
          "fee_payer": "payer",
          "amount": 11.08
      },
      {
          "type": "mercadopago_fee",
          "amount": 5.08,
          "fee_payer": "collector"
      }
  ],
  "charges_details": [
      {
          "id": "1322787973-001",
          "name": "mercadopago_fee",
          "type": "fee",
          "accounts": {
              "from": "collector",
              "to": "mp"
          },
          "client_id": 0,
          "date_created": "2024-04-24T13:35:27.569-04:00",
          "last_updated": "2024-04-24T13:35:27.569-04:00",
          "amounts": {
              "original": 5.08,
              "refunded": 0
          },
          "metadata": {},
          "reserve_id": null,
          "refund_charges": []
      },
      {
          "id": "1322787973-002",
          "name": "financing_fee",
          "type": "fee",
          "accounts": {
              "from": "payer",
              "to": "mp"
          },
          "client_id": 0,
          "date_created": "2024-04-24T13:35:27.631-04:00",
          "last_updated": "2024-04-24T13:35:27.631-04:00",
          "amounts": {
              "original": 11.08,
              "refunded": 0
          },
          "metadata": {},
          "reserve_id": null,
          "refund_charges": []
      }
  ],
  "captured": true,
  "binary_mode": false,
  "call_for_authorize_id": null,
  "statement_descriptor": null,
  "card": {
      "id": null,
      "first_six_digits": "503143",
      "last_four_digits": "6351",
      "expiration_month": 11,
      "expiration_year": 2025,
      "date_created": "2024-04-24T13:35:27.000-04:00",
      "date_last_updated": "2024-04-24T13:35:27.000-04:00",
      "country": null,
      "tags": null,
      "cardholder": {
          "name": "Maria Santos",
          "identification": {
              "number": "12345678909",
              "type": "CPF"
          }
      }
  },
  "notification_url": null,
  "refunds": [],
  "processing_mode": "aggregator",
  "merchant_account_id": null,
  "merchant_number": null,
  "acquirer_reconciliation": [],
  "point_of_interaction": {
      "type": "UNSPECIFIED",
      "business_info": {
          "unit": "online_payments",
          "sub_unit": "sdk",
          "branch": null
      }
  },
  "accounts_info": null,
  "tags": null,
  "api_response": {
      "status": 201,
      "headers": {
          "date": [
              "Wed, 24 Apr 2024 17:35:27 GMT"
          ],
          "content-type": [
              "application/json;charset=UTF-8"
          ],
          "transfer-encoding": [
              "chunked"
          ],
          "connection": [
              "keep-alive"
          ],
          "x-site-id": [
              "MLB"
          ],
          "vary": [
              "Accept,Accept-Encoding"
          ],
          "cache-control": [
              "max-age=0"
          ],
          "etag": [
              "07ea8cddaff08070c76cbf2e2370bc12"
          ],
          "x-content-type-options": [
              "nosniff"
          ],
          "x-request-id": [
              "50fc0bbd-d8b8-4dea-8596-0bd1850759e6"
          ],
          "x-xss-protection": [
              "1; mode=block"
          ],
          "strict-transport-security": [
              "max-age=16070400; includeSubDomains; preload"
          ],
          "access-control-allow-origin": [
              "*"
          ],
          "access-control-allow-headers": [
              "Content-Type"
          ],
          "access-control-allow-methods": [
              "PUT, GET, POST, DELETE, OPTIONS"
          ],
          "access-control-max-age": [
              "86400"
          ],
          "timing-allow-origin": [
              "*"
          ]
      }
  }
}