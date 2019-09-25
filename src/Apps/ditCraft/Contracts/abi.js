export default [
  {
    "constant": false,
    "inputs": [],
    "name": "cookingOrder",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "finishOrder",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_foodItem",
        "type": "string"
      },
      {
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "setOrder",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_orderStatus",
        "type": "string"
      }
    ],
    "name": "setOrderStatus",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "foodItem",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "name",
        "type": "string"
      }
    ],
    "name": "FoodFinished",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "foodItem",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "name",
        "type": "string"
      }
    ],
    "name": "OrderReceived",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "orderStatus",
        "type": "string"
      }
    ],
    "name": "OrderStatus",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getOrder",
    "outputs": [
      {
        "name": "",
        "type": "string"
      },
      {
        "name": "",
        "type": "string"
      },
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]
