import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MembershipMarketplace
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const membershipMarketplaceAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'membershipContract',
        internalType: 'contract MembershipPass1155',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'courseId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountPaid',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PassPurchased',
  },
  {
    type: 'function',
    inputs: [{ name: 'courseId', internalType: 'uint256', type: 'uint256' }],
    name: 'buy',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'membership',
    outputs: [
      {
        name: '',
        internalType: 'contract MembershipPass1155',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address payable', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MembershipPass1155
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const membershipPass1155Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'uri', internalType: 'string', type: 'string' },
      { name: 'admin', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'AccessControlBadConfirmation' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'neededRole', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'AmountMismatch',
  },
  {
    type: 'error',
    inputs: [{ name: 'courseId', internalType: 'uint256', type: 'uint256' }],
    name: 'CourseAlreadyExists',
  },
  {
    type: 'error',
    inputs: [{ name: 'courseId', internalType: 'uint256', type: 'uint256' }],
    name: 'CourseNotFound',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
  },
  { type: 'error', inputs: [], name: 'EnforcedPause' },
  { type: 'error', inputs: [], name: 'ExpectedPause' },
  { type: 'error', inputs: [], name: 'InvalidDuration' },
  { type: 'error', inputs: [], name: 'InvalidSplitter' },
  {
    type: 'error',
    inputs: [
      { name: 'courseId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'NotCourseCreator',
  },
  {
    type: 'error',
    inputs: [
      { name: 'courseId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'expiredAt', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'PassExpired',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [
      { name: 'courseId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'RenewalNotAllowed',
  },
  {
    type: 'error',
    inputs: [
      { name: 'courseId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'availableAt', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'TransferCooldownActive',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'TransferRestricted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'courseId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'duration',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'transferCooldown',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'CourseConfigUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'courseId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'priceWei',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'splitter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'duration',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'transferCooldown',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'CourseCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'courseId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'oldPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CoursePriceUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'courseId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'oldSplitter',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newSplitter',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'CourseSplitterUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'courseId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountPaid',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'expiresAt',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'PassMinted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'courseId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountPaid',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'previousExpiry',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'newExpiry',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'PassRenewed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'courseId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'expiresAt',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'cooldownEndsAt',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'PassStateUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CREATOR_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MARKETPLACE_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'REGISTRAR_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'courseId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'canTransfer',
    outputs: [
      { name: 'eligible', internalType: 'bool', type: 'bool' },
      { name: 'availableAt', internalType: 'uint64', type: 'uint64' },
      { name: 'expiresAt', internalType: 'uint64', type: 'uint64' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'courseId', internalType: 'uint256', type: 'uint256' },
      { name: 'priceWei', internalType: 'uint256', type: 'uint256' },
      { name: 'splitter', internalType: 'address', type: 'address' },
      { name: 'creator', internalType: 'address', type: 'address' },
      { name: 'duration', internalType: 'uint64', type: 'uint64' },
      { name: 'transferCooldown', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'createCourse',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'exists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'courseId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amountPaid', internalType: 'uint256', type: 'uint256' },
      { name: 'additionalDuration', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'extendPass',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'courseId', internalType: 'uint256', type: 'uint256' }],
    name: 'getCourse',
    outputs: [
      {
        name: '',
        internalType: 'struct MembershipPass1155.Course',
        type: 'tuple',
        components: [
          { name: 'priceWei', internalType: 'uint256', type: 'uint256' },
          { name: 'splitter', internalType: 'address', type: 'address' },
          { name: 'creator', internalType: 'address', type: 'address' },
          { name: 'duration', internalType: 'uint64', type: 'uint64' },
          { name: 'transferCooldown', internalType: 'uint64', type: 'uint64' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'courseId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'getPassState',
    outputs: [
      {
        name: '',
        internalType: 'struct MembershipPass1155.PassState',
        type: 'tuple',
        components: [
          { name: 'expiresAt', internalType: 'uint64', type: 'uint64' },
          { name: 'cooldownEndsAt', internalType: 'uint64', type: 'uint64' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'courseId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasPass',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'courseId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'isPassActive',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'courseId', internalType: 'uint256', type: 'uint256' },
      { name: 'amountPaid', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'marketplaceMint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'callerConfirmation', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'courseId', internalType: 'uint256', type: 'uint256' },
      { name: 'duration', internalType: 'uint64', type: 'uint64' },
      { name: 'transferCooldown', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'setCourseConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'courseId', internalType: 'uint256', type: 'uint256' },
      { name: 'newPriceWei', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setPrice',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'courseId', internalType: 'uint256', type: 'uint256' },
      { name: 'newSplitter', internalType: 'address', type: 'address' },
    ],
    name: 'setSplitter',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newURI', internalType: 'string', type: 'string' }],
    name: 'setURI',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Registrar
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const registrarAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'membershipContract',
        internalType: 'contract MembershipPass1155',
        type: 'address',
      },
      { name: 'admin', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'AccessControlBadConfirmation' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'neededRole', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'courseId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'splitter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'priceWei',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'duration',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'transferCooldown',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'CourseRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'marketplace',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'membership',
    outputs: [
      {
        name: '',
        internalType: 'contract MembershipPass1155',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'courseId', internalType: 'uint256', type: 'uint256' },
      { name: 'priceWei', internalType: 'uint256', type: 'uint256' },
      { name: 'recipients', internalType: 'address[]', type: 'address[]' },
      { name: 'sharesBps', internalType: 'uint32[]', type: 'uint32[]' },
      { name: 'duration', internalType: 'uint64', type: 'uint64' },
      { name: 'transferCooldown', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'registerCourse',
    outputs: [
      { name: 'splitterAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'callerConfirmation', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'marketplaceAddress', internalType: 'address', type: 'address' },
    ],
    name: 'setMarketplace',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipMarketplaceAbi}__
 */
export const useReadMembershipMarketplace = /*#__PURE__*/ createUseReadContract(
  { abi: membershipMarketplaceAbi },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipMarketplaceAbi}__ and `functionName` set to `"membership"`
 */
export const useReadMembershipMarketplaceMembership =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipMarketplaceAbi,
    functionName: 'membership',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipMarketplaceAbi}__ and `functionName` set to `"owner"`
 */
export const useReadMembershipMarketplaceOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipMarketplaceAbi,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipMarketplaceAbi}__
 */
export const useWriteMembershipMarketplace =
  /*#__PURE__*/ createUseWriteContract({ abi: membershipMarketplaceAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipMarketplaceAbi}__ and `functionName` set to `"buy"`
 */
export const useWriteMembershipMarketplaceBuy =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipMarketplaceAbi,
    functionName: 'buy',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipMarketplaceAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteMembershipMarketplaceWithdraw =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipMarketplaceAbi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipMarketplaceAbi}__
 */
export const useSimulateMembershipMarketplace =
  /*#__PURE__*/ createUseSimulateContract({ abi: membershipMarketplaceAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipMarketplaceAbi}__ and `functionName` set to `"buy"`
 */
export const useSimulateMembershipMarketplaceBuy =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipMarketplaceAbi,
    functionName: 'buy',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipMarketplaceAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateMembershipMarketplaceWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipMarketplaceAbi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipMarketplaceAbi}__
 */
export const useWatchMembershipMarketplaceEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: membershipMarketplaceAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipMarketplaceAbi}__ and `eventName` set to `"PassPurchased"`
 */
export const useWatchMembershipMarketplacePassPurchasedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipMarketplaceAbi,
    eventName: 'PassPurchased',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__
 */
export const useReadMembershipPass1155 = /*#__PURE__*/ createUseReadContract({
  abi: membershipPass1155Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"ADMIN_ROLE"`
 */
export const useReadMembershipPass1155AdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'ADMIN_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"CREATOR_ROLE"`
 */
export const useReadMembershipPass1155CreatorRole =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'CREATOR_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 */
export const useReadMembershipPass1155DefaultAdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'DEFAULT_ADMIN_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"MARKETPLACE_ROLE"`
 */
export const useReadMembershipPass1155MarketplaceRole =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'MARKETPLACE_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"REGISTRAR_ROLE"`
 */
export const useReadMembershipPass1155RegistrarRole =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'REGISTRAR_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadMembershipPass1155BalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadMembershipPass1155BalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"canTransfer"`
 */
export const useReadMembershipPass1155CanTransfer =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'canTransfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"exists"`
 */
export const useReadMembershipPass1155Exists =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'exists',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"getCourse"`
 */
export const useReadMembershipPass1155GetCourse =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'getCourse',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"getPassState"`
 */
export const useReadMembershipPass1155GetPassState =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'getPassState',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadMembershipPass1155GetRoleAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'getRoleAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"hasPass"`
 */
export const useReadMembershipPass1155HasPass =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'hasPass',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"hasRole"`
 */
export const useReadMembershipPass1155HasRole =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'hasRole',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadMembershipPass1155IsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"isPassActive"`
 */
export const useReadMembershipPass1155IsPassActive =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'isPassActive',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"paused"`
 */
export const useReadMembershipPass1155Paused =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'paused',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadMembershipPass1155SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadMembershipPass1155TotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: membershipPass1155Abi,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"uri"`
 */
export const useReadMembershipPass1155Uri = /*#__PURE__*/ createUseReadContract(
  { abi: membershipPass1155Abi, functionName: 'uri' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipPass1155Abi}__
 */
export const useWriteMembershipPass1155 = /*#__PURE__*/ createUseWriteContract({
  abi: membershipPass1155Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"createCourse"`
 */
export const useWriteMembershipPass1155CreateCourse =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipPass1155Abi,
    functionName: 'createCourse',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"extendPass"`
 */
export const useWriteMembershipPass1155ExtendPass =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipPass1155Abi,
    functionName: 'extendPass',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteMembershipPass1155GrantRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipPass1155Abi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"marketplaceMint"`
 */
export const useWriteMembershipPass1155MarketplaceMint =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipPass1155Abi,
    functionName: 'marketplaceMint',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"pause"`
 */
export const useWriteMembershipPass1155Pause =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipPass1155Abi,
    functionName: 'pause',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteMembershipPass1155RenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipPass1155Abi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteMembershipPass1155RevokeRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipPass1155Abi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteMembershipPass1155SafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipPass1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteMembershipPass1155SafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipPass1155Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteMembershipPass1155SetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipPass1155Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"setCourseConfig"`
 */
export const useWriteMembershipPass1155SetCourseConfig =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipPass1155Abi,
    functionName: 'setCourseConfig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"setPrice"`
 */
export const useWriteMembershipPass1155SetPrice =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipPass1155Abi,
    functionName: 'setPrice',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"setSplitter"`
 */
export const useWriteMembershipPass1155SetSplitter =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipPass1155Abi,
    functionName: 'setSplitter',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"setURI"`
 */
export const useWriteMembershipPass1155SetUri =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipPass1155Abi,
    functionName: 'setURI',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"unpause"`
 */
export const useWriteMembershipPass1155Unpause =
  /*#__PURE__*/ createUseWriteContract({
    abi: membershipPass1155Abi,
    functionName: 'unpause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipPass1155Abi}__
 */
export const useSimulateMembershipPass1155 =
  /*#__PURE__*/ createUseSimulateContract({ abi: membershipPass1155Abi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"createCourse"`
 */
export const useSimulateMembershipPass1155CreateCourse =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipPass1155Abi,
    functionName: 'createCourse',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"extendPass"`
 */
export const useSimulateMembershipPass1155ExtendPass =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipPass1155Abi,
    functionName: 'extendPass',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateMembershipPass1155GrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipPass1155Abi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"marketplaceMint"`
 */
export const useSimulateMembershipPass1155MarketplaceMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipPass1155Abi,
    functionName: 'marketplaceMint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"pause"`
 */
export const useSimulateMembershipPass1155Pause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipPass1155Abi,
    functionName: 'pause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateMembershipPass1155RenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipPass1155Abi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateMembershipPass1155RevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipPass1155Abi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateMembershipPass1155SafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipPass1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateMembershipPass1155SafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipPass1155Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateMembershipPass1155SetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipPass1155Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"setCourseConfig"`
 */
export const useSimulateMembershipPass1155SetCourseConfig =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipPass1155Abi,
    functionName: 'setCourseConfig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"setPrice"`
 */
export const useSimulateMembershipPass1155SetPrice =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipPass1155Abi,
    functionName: 'setPrice',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"setSplitter"`
 */
export const useSimulateMembershipPass1155SetSplitter =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipPass1155Abi,
    functionName: 'setSplitter',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"setURI"`
 */
export const useSimulateMembershipPass1155SetUri =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipPass1155Abi,
    functionName: 'setURI',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link membershipPass1155Abi}__ and `functionName` set to `"unpause"`
 */
export const useSimulateMembershipPass1155Unpause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: membershipPass1155Abi,
    functionName: 'unpause',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__
 */
export const useWatchMembershipPass1155Event =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: membershipPass1155Abi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchMembershipPass1155ApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipPass1155Abi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__ and `eventName` set to `"CourseConfigUpdated"`
 */
export const useWatchMembershipPass1155CourseConfigUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipPass1155Abi,
    eventName: 'CourseConfigUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__ and `eventName` set to `"CourseCreated"`
 */
export const useWatchMembershipPass1155CourseCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipPass1155Abi,
    eventName: 'CourseCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__ and `eventName` set to `"CoursePriceUpdated"`
 */
export const useWatchMembershipPass1155CoursePriceUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipPass1155Abi,
    eventName: 'CoursePriceUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__ and `eventName` set to `"CourseSplitterUpdated"`
 */
export const useWatchMembershipPass1155CourseSplitterUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipPass1155Abi,
    eventName: 'CourseSplitterUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__ and `eventName` set to `"PassMinted"`
 */
export const useWatchMembershipPass1155PassMintedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipPass1155Abi,
    eventName: 'PassMinted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__ and `eventName` set to `"PassRenewed"`
 */
export const useWatchMembershipPass1155PassRenewedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipPass1155Abi,
    eventName: 'PassRenewed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__ and `eventName` set to `"PassStateUpdated"`
 */
export const useWatchMembershipPass1155PassStateUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipPass1155Abi,
    eventName: 'PassStateUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__ and `eventName` set to `"Paused"`
 */
export const useWatchMembershipPass1155PausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipPass1155Abi,
    eventName: 'Paused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchMembershipPass1155RoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipPass1155Abi,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchMembershipPass1155RoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipPass1155Abi,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchMembershipPass1155RoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipPass1155Abi,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchMembershipPass1155TransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipPass1155Abi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchMembershipPass1155TransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipPass1155Abi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__ and `eventName` set to `"URI"`
 */
export const useWatchMembershipPass1155UriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipPass1155Abi,
    eventName: 'URI',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link membershipPass1155Abi}__ and `eventName` set to `"Unpaused"`
 */
export const useWatchMembershipPass1155UnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: membershipPass1155Abi,
    eventName: 'Unpaused',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link registrarAbi}__
 */
export const useReadRegistrar = /*#__PURE__*/ createUseReadContract({
  abi: registrarAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"ADMIN_ROLE"`
 */
export const useReadRegistrarAdminRole = /*#__PURE__*/ createUseReadContract({
  abi: registrarAbi,
  functionName: 'ADMIN_ROLE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 */
export const useReadRegistrarDefaultAdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: registrarAbi,
    functionName: 'DEFAULT_ADMIN_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadRegistrarGetRoleAdmin = /*#__PURE__*/ createUseReadContract(
  { abi: registrarAbi, functionName: 'getRoleAdmin' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadRegistrarHasRole = /*#__PURE__*/ createUseReadContract({
  abi: registrarAbi,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"marketplace"`
 */
export const useReadRegistrarMarketplace = /*#__PURE__*/ createUseReadContract({
  abi: registrarAbi,
  functionName: 'marketplace',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"membership"`
 */
export const useReadRegistrarMembership = /*#__PURE__*/ createUseReadContract({
  abi: registrarAbi,
  functionName: 'membership',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadRegistrarSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: registrarAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link registrarAbi}__
 */
export const useWriteRegistrar = /*#__PURE__*/ createUseWriteContract({
  abi: registrarAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteRegistrarGrantRole = /*#__PURE__*/ createUseWriteContract({
  abi: registrarAbi,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"registerCourse"`
 */
export const useWriteRegistrarRegisterCourse =
  /*#__PURE__*/ createUseWriteContract({
    abi: registrarAbi,
    functionName: 'registerCourse',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteRegistrarRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: registrarAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteRegistrarRevokeRole = /*#__PURE__*/ createUseWriteContract(
  { abi: registrarAbi, functionName: 'revokeRole' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"setMarketplace"`
 */
export const useWriteRegistrarSetMarketplace =
  /*#__PURE__*/ createUseWriteContract({
    abi: registrarAbi,
    functionName: 'setMarketplace',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link registrarAbi}__
 */
export const useSimulateRegistrar = /*#__PURE__*/ createUseSimulateContract({
  abi: registrarAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateRegistrarGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: registrarAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"registerCourse"`
 */
export const useSimulateRegistrarRegisterCourse =
  /*#__PURE__*/ createUseSimulateContract({
    abi: registrarAbi,
    functionName: 'registerCourse',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateRegistrarRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: registrarAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateRegistrarRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: registrarAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link registrarAbi}__ and `functionName` set to `"setMarketplace"`
 */
export const useSimulateRegistrarSetMarketplace =
  /*#__PURE__*/ createUseSimulateContract({
    abi: registrarAbi,
    functionName: 'setMarketplace',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link registrarAbi}__
 */
export const useWatchRegistrarEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: registrarAbi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link registrarAbi}__ and `eventName` set to `"CourseRegistered"`
 */
export const useWatchRegistrarCourseRegisteredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: registrarAbi,
    eventName: 'CourseRegistered',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link registrarAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchRegistrarRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: registrarAbi,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link registrarAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchRegistrarRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: registrarAbi,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link registrarAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchRegistrarRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: registrarAbi,
    eventName: 'RoleRevoked',
  })
