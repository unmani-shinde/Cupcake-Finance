module cupcake_addr::cupcake_finance{

    //Dependencies
    use std::signer;
    use liquidswap::router_v2;
    use liquidswap::curves::Uncorrelated;
    use aptos_std::table::{Self,Table};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin;
    // use std::vector;
    //use std::string::String;

    // Test BTC
    use 0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::BTC;
    // Test USDT
    use 0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::USDT;

    //Errors
    const E_NOT_INITIALIZED: u64 =1;
    const E_ZERO_REBALANCE_INTERVAL_FOR_REBALANCE: u64 =2;
    const E_NON_ZERO_REBALANCE_INTERVAL_FOR_SWAP: u64 =3;

    struct User has key,store{
    userWalletAddress:address,
    userTokenBasketCount:u64,
    userTokenSwapCount: u64,
    userTokenBaskets: Table<u64, Basket>,
    userSwapHistory: Table<u64,Basket>
    
    }

    struct Basket has store, drop, copy {
    basketID: u64,
    basketAPT: u64,
    basketUSDTRatio: u64,
    basketBTCRatio: u64,
    basketRebalanceInterval: u64,
    swap_or_rebalance: bool, //false - swap, true - rebalance;
    lastRebalanceTimestamp: u64,    
    }
    
    public entry fun authorize_user(account: &signer){
        let signer_address = signer::address_of(account);
        let user = User{
            userWalletAddress: signer_address,
            userTokenBaskets: table::new(),
            userSwapHistory: table::new(),
            userTokenBasketCount: 0,
            userTokenSwapCount: 0
        };
        move_to(account,user);
    }

    public entry fun create_token_basket(account: &signer,aptos_amount_to_swap:u64,usdt_ratio:u64,btc_ratio:u64,rebalance_interval_days:u64,rebalance_set:bool) acquires User{

        let account_addr = signer::address_of(account);
        if (!exists<User>(account_addr)){authorize_user(account)};
        swap_apt_for_alt_coin(account,aptos_amount_to_swap,usdt_ratio,btc_ratio);

        assert!(exists<User>(account_addr),E_NOT_INITIALIZED);
        //If rebalancing is selected, the rebalancing interval should be positive
        assert!(rebalance_set && rebalance_interval_days<=0,E_ZERO_REBALANCE_INTERVAL_FOR_REBALANCE);
        //If swap is selected, the rebalancing interval should be zero.
        assert!(!(rebalance_set) && !(rebalance_interval_days==0),E_NON_ZERO_REBALANCE_INTERVAL_FOR_SWAP);
        let user = borrow_global_mut<User>(account_addr);
        let counter: u64;
        if(rebalance_set){counter = user.userTokenBasketCount +1;}
        else{counter = user.userTokenSwapCount +1};

        let new_basket = Basket{
            basketID: counter,
            basketAPT: aptos_amount_to_swap,
            basketUSDTRatio:usdt_ratio,
            basketBTCRatio:btc_ratio,
            swap_or_rebalance: rebalance_set,
            basketRebalanceInterval:rebalance_interval_days,
            lastRebalanceTimestamp: 0
        };
        if(rebalance_set){
            table::upsert(&mut user.userTokenBaskets,counter,new_basket);
            user.userTokenBasketCount = counter;
        }
        else{
            table::upsert(&mut user.userSwapHistory,counter,new_basket);
            user.userTokenSwapCount= counter;
        }   

    }

    // Function to create a rebalancing strategy for a basket
    // public entry fun set_rebalance_strategy(account: &signer, basket_id: u64, rebalance_interval_days: u64) {
    //     let strategy = RebalanceStrategy {
    //         basket_id: basket_id,
    //         rebalance_interval_days: rebalance_interval_days,
    //     };
    //     save<RebalanceStrategy>(account, strategy);
    // }

    //  public fun auto_rebalance_portfolio() {
    //     // Iterate through all saved rebalancing strategies
    //     let all_strategies = vector::empty<RebalanceStrategy>();
    //     let _values = get_values<RebalanceStrategy>();
    //    while (!values.is_empty()) {
    //         let strategy = values.pop_back().unwrap();
    //         all_strategies.push_back(strategy);
    //     }
    //  }



    public entry fun swap_apt_for_alt_coin(account: &signer,aptos_amount_to_swap:u64,usdt_ratio:u64,btc_ratio:u64){ 

        let account_addr = signer::address_of(account);        

        let aptos_amount_to_swap_for_btc = aptos_amount_to_swap*btc_ratio;
        let aptos_amount_to_swap_for_usdt = aptos_amount_to_swap*usdt_ratio;

        let usdt_amount_to_get = router_v2::get_amount_out<AptosCoin, USDT, Uncorrelated>(
            aptos_amount_to_swap_for_usdt,
        );

        let btc_amount_to_get = router_v2::get_amount_out<AptosCoin, BTC, Uncorrelated>(
            aptos_amount_to_swap_for_btc,
        );

        let aptos_coins_to_swap_for_usdt = coin::withdraw<AptosCoin>(account, aptos_amount_to_swap_for_usdt);
        let aptos_coins_to_swap_for_btc = coin::withdraw<AptosCoin>(account, aptos_amount_to_swap_for_btc);

        let usdt = router_v2::swap_exact_coin_for_coin<AptosCoin, USDT, Uncorrelated>(
            aptos_coins_to_swap_for_usdt,
            usdt_amount_to_get
        );

        let btc = router_v2::swap_exact_coin_for_coin<AptosCoin, BTC, Uncorrelated>(
            aptos_coins_to_swap_for_btc,
            btc_amount_to_get
        );

        // Register BTC coin on account in case the account don't have it.
        if (!coin::is_account_registered<USDT>(account_addr)) {
            coin::register<USDT>(account);
        };

        if (!coin::is_account_registered<BTC>(account_addr)) {
            coin::register<BTC>(account);
        };
        // Deposit on account.
        coin::deposit(account_addr, usdt);
        coin::deposit(account_addr, btc);

        

        
        
    }
    



}