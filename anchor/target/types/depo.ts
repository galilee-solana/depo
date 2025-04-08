/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/depo.json`.
 */
export type Depo = {
  "address": "coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF",
  "metadata": {
    "name": "depo",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createEscrow",
      "discriminator": [
        253,
        215,
        165,
        116,
        36,
        108,
        68,
        80
      ],
      "accounts": [
        {
          "name": "escrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "arg",
                "path": "escrowId"
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "escrowId",
          "type": {
            "array": [
              "u8",
              16
            ]
          }
        },
        {
          "name": "name",
          "type": "bytes"
        },
        {
          "name": "description",
          "type": "bytes"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "escrow",
      "discriminator": [
        31,
        213,
        123,
        187,
        186,
        22,
        218,
        155
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "nameTooLong",
      "msg": "Escrow name is too long. Max length: 100 bytes."
    },
    {
      "code": 6001,
      "name": "descriptionTooLong",
      "msg": "Escrow description is too long. Max length: 200 bytes."
    }
  ],
  "types": [
    {
      "name": "escrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": {
              "array": [
                "u8",
                16
              ]
            }
          },
          {
            "name": "initialiser",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": {
              "array": [
                "u8",
                100
              ]
            }
          },
          {
            "name": "description",
            "type": {
              "array": [
                "u8",
                200
              ]
            }
          },
          {
            "name": "totalAmount",
            "type": "u64"
          },
          {
            "name": "isPublicDeposit",
            "type": "bool"
          },
          {
            "name": "depositorsCount",
            "type": "u32"
          },
          {
            "name": "recipientsCount",
            "type": "u32"
          },
          {
            "name": "modules",
            "type": {
              "vec": {
                "defined": {
                  "name": "moduleType"
                }
              }
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "status"
              }
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "moduleType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "timeLock"
          },
          {
            "name": "expiryFallback"
          },
          {
            "name": "singleApproval"
          },
          {
            "name": "multisigApproval"
          },
          {
            "name": "targetAmount"
          },
          {
            "name": "minimumAmount"
          }
        ]
      }
    },
    {
      "name": "status",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "draft"
          },
          {
            "name": "started"
          },
          {
            "name": "released"
          },
          {
            "name": "cancelled"
          },
          {
            "name": "expired"
          }
        ]
      }
    }
  ]
};
