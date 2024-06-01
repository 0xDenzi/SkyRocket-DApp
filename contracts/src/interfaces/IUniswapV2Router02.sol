// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IUniswapV2Router02 {
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);

    // This function allows for an exact amount of input tokens to be swapped for as many output tokens as possible, 
    // along the route determined by the path array you provide when calling the function.
    function swapExactTokensForTokens(
        uint amountIn,         // Amount of input tokens to send.
        uint amountOutMin,     // Minimum amount of output tokens that must be received for the transaction not to revert.
        address[] calldata path, // An array of token addresses. This will determine the token swap route, 
                                  // e.g., [WETH, USDC] means swapping WETH for USDC.
        address to,             // Address to send the output tokens to.
        uint deadline           // Timestamp after which the transaction will revert if not processed.
    ) external returns (uint[] memory amounts);
}