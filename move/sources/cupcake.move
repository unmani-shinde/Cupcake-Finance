module cupcake_addr::cupcakeDEFI{
    use std::signer;
    use liquidswap::router_v2;
    use liquidswap::curves::Uncorrelated;
    // use std::string::String;
    use aptos_std::table::{Self,Table};
    // use liquidswap::coin_helper::is_sorted;
    // use liquidswap_lp::lp_coin::LP;
    // use test_coins::coins::{BTC};
    // use test_coins_extended::extended_coins::{ETH};
    // use test_coins_extended::extended_coins::{USDC, ETH, DAI};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin;

    // Test BTC
    use 0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::BTC;

    // Test ETH
    // use test_coins_extended::coins_extended::ETH;

    // Test USDT
    use 0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::USDT;

    const E_NOT_INITIALIZED: u64 =1;
    // const ETASK_DOESNT_EXIST: u64 = 2;
    // const ETASK_IS_COMPLETED: u64 = 3;

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

    struct User has key,store{
        userWalletAddress:address,
        userTokenBasketCount:u64,
        userTokenBaskets: Table<u64, Basket>,
    }

    struct Basket has store,drop,copy{
        basketID: u64,
        basketAPT: u64,
        basketBTCRatio:u64,
        basketUSDTRatio:u64,
        basketRebalanceInterval: u64,
    }
    
    public entry fun create_user(account: &signer){
        let signer_address = signer::address_of(account);
        let user = User{
            userWalletAddress: signer_address,
            userTokenBaskets: table::new(),
            userTokenBasketCount: 0
        };
        move_to(account,user);
    }
   
    public entry fun create_token_basket(account: &signer,aptos_amount_to_swap:u64, aptos_amount_to_swap_for_usdt:u64, aptos_amount_to_swap_for_btc:u64,usdt_ratio:u64,btc_ratio:u64,rebalance_interval_days:u64) acquires User{
        
        let account_addr = signer::address_of(account);
         if (!exists<User>(account_addr)){create_user(account)};                
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

        // let eth_amount_to_get = router_v2::get_amount_out<AptosCoin, ETH, Uncorrelated>(
        //     aptos_amount_to_swap_for_eth,
        // );
        

        let aptos_coins_to_swap_for_usdt = coin::withdraw<AptosCoin>(account, aptos_amount_to_swap_for_usdt);
        let aptos_coins_to_swap_for_btc = coin::withdraw<AptosCoin>(account, aptos_amount_to_swap_for_btc);
        // let aptos_coins_to_swap_for_eth = coin::withdraw<AptosCoin>(account, aptos_amount_to_swap_for_eth);
        

        let usdt = router_v2::swap_exact_coin_for_coin<AptosCoin, USDT, Uncorrelated>(
            aptos_coins_to_swap_for_usdt,
            usdt_amount_to_get
        );

        let btc = router_v2::swap_exact_coin_for_coin<AptosCoin, BTC, Uncorrelated>(
            aptos_coins_to_swap_for_btc,
            btc_amount_to_get
        );

        //  let eth = router_v2::swap_exact_coin_for_coin<AptosCoin, ETH, Uncorrelated>(
        //     aptos_coins_to_swap_for_eth,
        //     eth_amount_to_get
        // );

        

        // Register BTC coin on account in case the account don't have it.
        if (!coin::is_account_registered<USDT>(account_addr)) {
            coin::register<USDT>(account);
        };

        if (!coin::is_account_registered<BTC>(account_addr)) {
            coin::register<BTC>(account);
        };

        // if (!coin::is_account_registered<ETH>(account_addr)) {
        //     coin::register<ETH>(account);
        // };
        // Deposit on account.
        coin::deposit(account_addr, usdt);
        coin::deposit(account_addr, btc);

        let signer_address = signer::address_of(account);
        assert!(exists<User>(signer_address),E_NOT_INITIALIZED);
        let user = borrow_global_mut<User>(signer_address);
        let counter = user.userTokenBasketCount +1 ;
        let new_basket = Basket{
            basketID: counter,
            basketAPT: aptos_amount_to_swap,
            basketUSDTRatio:usdt_ratio,
            basketBTCRatio:btc_ratio,
            basketRebalanceInterval:rebalance_interval_days
        };
        table::upsert(&mut user.userTokenBaskets,counter,new_basket);
        user.userTokenBasketCount = counter;
        // event::emit_event<Task>(&mut borrow_global_mut<TodoList>(signer_address).set_task_event,new_task);
    

    }

    public entry fun reverse_swap(account:&signer,usdt_amount_to_swap_for_apt:u64,btc_amount_to_swap_for_apt:u64){

        let account_addr = signer::address_of(account);
        // if (!exists<User>(account_addr)){create_user(account)};  

        let apt_amount_to_get_from_usdt = router_v2::get_amount_out<USDT,AptosCoin, Uncorrelated>(
            usdt_amount_to_swap_for_apt,
        );

        let apt_amount_to_get_from_btc = router_v2::get_amount_out<BTC,AptosCoin, Uncorrelated>(
            btc_amount_to_swap_for_apt,
        );

        let usdt_coins_to_swap_for_aptos = coin::withdraw<USDT>(account, usdt_amount_to_swap_for_apt);
        let btc_coins_to_swap_for_aptos = coin::withdraw<BTC>(account, btc_amount_to_swap_for_apt);

        let apt_usdt = router_v2::swap_exact_coin_for_coin<USDT, AptosCoin, Uncorrelated>(
            usdt_coins_to_swap_for_aptos,
            apt_amount_to_get_from_usdt
        );

        let apt_btc = router_v2::swap_exact_coin_for_coin<BTC, AptosCoin, Uncorrelated>(
            btc_coins_to_swap_for_aptos,
            apt_amount_to_get_from_btc
        );
        // if (!coin::is_account_registered<ETH>(account_addr)) {
        //     coin::register<ETH>(account);
        // };
        // Deposit on account.
        coin::deposit(account_addr, apt_usdt);
        coin::deposit(account_addr, apt_btc);

    }



        // coin::deposit(account_addr, eth);







    
    

}