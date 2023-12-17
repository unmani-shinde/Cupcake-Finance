module cupcake_addr::cupcakeDEFI{
    use std::signer;
    use liquidswap::router_v2;
    use liquidswap::curves::Uncorrelated;
    // use test_coins::coins::{BTC};
    // use test_coins_extended::extended_coins::{ETH};
    // use test_coins_extended::extended_coins::{USDC, ETH, DAI};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin;

    // Test BTC
    use 0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::BTC;

    // Test ETH
    use test_coins_extended::coins_extended::ETH;

    // Test USDT
    use 0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::USDT;

    // btc_min_value_to_get: u64

    // public entry fun buy_usdt(account: &signer, aptos_amount_to_swap:u64 ) {
    //     // let aptos_amount_to_swap = 1;
    //     let usdt_amount_to_get = router_v2::get_amount_out<AptosCoin, USDT, Uncorrelated>(
    //         aptos_amount_to_swap,
    //     );
        
    //     let aptos_coins_to_swap = coin::withdraw<AptosCoin>(account, aptos_amount_to_swap);

    //     let usdt = router_v2::swap_exact_coin_for_coin<AptosCoin, USDT, Uncorrelated>(
    //         aptos_coins_to_swap,
    //         usdt_amount_to_get
    //     );

    //     let account_addr = signer::address_of(account);

    //     // Register BTC coin on account in case the account don't have it.
    //     if (!coin::is_account_registered<USDT>(account_addr)) {
    //         coin::register<USDT>(account);
    //     };
    //     // Deposit on account.
    //     coin::deposit(account_addr, usdt);
    // }

    // public entry fun buy_btc(account: &signer, aptos_amount_to_swap:u64 ) {
    //     // let aptos_amount_to_swap = 1;
    //     let btc_amount_to_get = router_v2::get_amount_out<AptosCoin, BTC, Uncorrelated>(
    //         aptos_amount_to_swap,
    //     );
        
    //     let aptos_coins_to_swap = coin::withdraw<AptosCoin>(account, aptos_amount_to_swap);

    //     let btc = router_v2::swap_exact_coin_for_coin<AptosCoin, BTC, Uncorrelated>(
    //         aptos_coins_to_swap,
    //         btc_amount_to_get
    //     );

    //     let account_addr = signer::address_of(account);

    //     // Register BTC coin on account in case the account don't have it.
    //     if (!coin::is_account_registered<BTC>(account_addr)) {
    //         coin::register<BTC>(account);
    //     };
    //     // Deposit on account.
    //     coin::deposit(account_addr, btc);
    // }

    public entry fun create_token_basket(account: &signer, aptos_amount_to_swap_for_usdt:u64, aptos_amount_to_swap_for_btc:u64,aptos_amount_to_swap_for_eth:u64){
        // aptos_amount_to_swap_for_eth:u64

        // let aptos_amount_to_swap_for_usdt = aptos_amount_to_swap*usdt_ratio;
        // let aptos_amount_to_swap_for_btc = aptos_amount_to_swap*btc_ratio;
        // let aptos_amount_to_swap_for_eth = aptos_amount_to_swap*eth_ratio;


        let usdt_amount_to_get = router_v2::get_amount_out<AptosCoin, USDT, Uncorrelated>(
            aptos_amount_to_swap_for_usdt,
        );

        let btc_amount_to_get = router_v2::get_amount_out<AptosCoin, BTC, Uncorrelated>(
            aptos_amount_to_swap_for_btc,
        );

        let eth_amount_to_get = router_v2::get_amount_out<AptosCoin, ETH, Uncorrelated>(
            aptos_amount_to_swap_for_eth,
        );
        

        let aptos_coins_to_swap_for_usdt = coin::withdraw<AptosCoin>(account, aptos_amount_to_swap_for_usdt);
        let aptos_coins_to_swap_for_btc = coin::withdraw<AptosCoin>(account, aptos_amount_to_swap_for_btc);
        let aptos_coins_to_swap_for_eth = coin::withdraw<AptosCoin>(account, aptos_amount_to_swap_for_eth);
        

        let usdt = router_v2::swap_exact_coin_for_coin<AptosCoin, USDT, Uncorrelated>(
            aptos_coins_to_swap_for_usdt,
            usdt_amount_to_get
        );

        let btc = router_v2::swap_exact_coin_for_coin<AptosCoin, BTC, Uncorrelated>(
            aptos_coins_to_swap_for_btc,
            btc_amount_to_get
        );

         let eth = router_v2::swap_exact_coin_for_coin<AptosCoin, ETH, Uncorrelated>(
            aptos_coins_to_swap_for_eth,
            eth_amount_to_get
        );

        let account_addr = signer::address_of(account);

        // Register BTC coin on account in case the account don't have it.
        if (!coin::is_account_registered<USDT>(account_addr)) {
            coin::register<USDT>(account);
        };

        if (!coin::is_account_registered<BTC>(account_addr)) {
            coin::register<BTC>(account);
        };

        if (!coin::is_account_registered<ETH>(account_addr)) {
            coin::register<ETH>(account);
        };
        // Deposit on account.
        coin::deposit(account_addr, usdt);
        coin::deposit(account_addr, btc);
        coin::deposit(account_addr, eth);





    }

    
    

}