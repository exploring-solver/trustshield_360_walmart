// File: blockchain/contracts/TransactionLedger.sol

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract TransactionLedger {
    // A struct to hold the details of a logged transaction
    struct Transaction {
        string transactionId;
        address verifier; // The address that logged this transaction
        uint256 amount;
        uint256 riskScore; // A score from 0-100 (e.g., 0.98 becomes 98)
        uint256 timestamp;
    }

    // A mapping from a transaction ID string to the Transaction struct
    mapping(string => Transaction) public transactions;

    // An event that is emitted each time a transaction is logged
    event TransactionLogged(
        string indexed transactionId,
        address indexed verifier,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev Logs a new transaction to the blockchain.
     * @param _transactionId A unique identifier for the transaction.
     * @param _amount The transaction amount.
     * @param _riskScore The risk score calculated by the AI Cortex.
     */
    function logTransaction(
        string memory _transactionId,
        uint256 _amount,
        uint256 _riskScore
    ) public {
        // Ensure the transaction has not been logged before
        require(
            transactions[_transactionId].timestamp == 0,
            "Transaction ID already exists."
        );

        // Store the new transaction
        transactions[_transactionId] = Transaction({
            transactionId: _transactionId,
            verifier: msg.sender, // The account calling the contract
            amount: _amount,
            riskScore: _riskScore,
            timestamp: block.timestamp // The current block's timestamp
        });

        // Emit an event to notify listeners
        emit TransactionLogged(
            _transactionId,
            msg.sender,
            _amount,
            block.timestamp
        );
    }

    /**
     * @dev Retrieves a transaction by its ID.
     * @param _transactionId The ID of the transaction to retrieve.
     * @return The details of the stored transaction.
     */
    function getTransaction(string memory _transactionId)
        public
        view
        returns (Transaction memory)
    {
        return transactions[_transactionId];
    }
}