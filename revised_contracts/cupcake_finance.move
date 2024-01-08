module cupcake_addr::cupcake_finance{

    //Dependencies
    use std::signer;
    use liquidswap::router_v2;
    use liquidswap::curves::Uncorrelated;
    use aptos_std::table::{Self,Table};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin;
    use std::vector;
    use aptos_framework::account;
    //use std::string::String;

    // Test BTC
    use 0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::BTC;
    // Test USDT
    use 0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::USDT;

    const E_NOT_INITIALIZED: u64 =1;

    struct User has key,store{
        rebalancer_baskets: Table<u64, RebalancerBasket>,
        rebalancer_baskets_count:u64
    }
    
    struct RebalancerBasket has store, drop{
        basket_id: u64,
        source: address,
        original_portfolio_value_in_octa: u64,
        target_weights: vector<u64>,
        signer_capability: account::SignerCapability
    }

    public fun authorize_user(account: &signer){
        let user = User{
            rebalancer_baskets: table::new(),
            rebalancer_baskets_count: 0
        };
        move_to(account,user);
    }

    public entry fun create_rebalancer_basket(account: &signer,aptos_amount_to_swap:u64, aptos_amount_to_swap_for_usdt:u64, aptos_amount_to_swap_for_btc:u64,usdt_ratio:u64,btc_ratio:u64,_rebalance_interval_days:u64,seeds:vector<u8>) acquires User{

        let (vault, vault_signer_cap) = account::create_resource_account(account, seeds);
        let _resource_account_from_cap = account::create_signer_with_capability(&vault_signer_cap);
        let vault_addr = signer::address_of(&vault); 
        
        let account_addr = signer::address_of(account);
        if (!exists<User>(account_addr)){authorize_user(account)};

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

        if (!coin::is_account_registered<USDT>(account_addr)) {
            coin::register<USDT>(account);
        };

        if (!coin::is_account_registered<BTC>(account_addr)) {
            coin::register<BTC>(account);
        };

         if (!coin::is_account_registered<USDT>(vault_addr)) {
            coin::register<USDT>(&vault);
        };

        if (!coin::is_account_registered<BTC>(vault_addr)) {
            coin::register<BTC>(&vault);
        };

        coin::deposit(vault_addr, usdt);
        coin::deposit(vault_addr, btc);

       

        let signer_address = signer::address_of(account);
        assert!(exists<User>(signer_address),E_NOT_INITIALIZED);
        
        let v = vector::empty<u64>();
        vector::push_back(&mut v, usdt_ratio);
        vector::push_back(&mut v, btc_ratio);

        let user = borrow_global_mut<User>(signer_address);
        let counter = user.rebalancer_baskets_count +1 ;
        let new_basket = RebalancerBasket{
            basket_id:counter,
            source:signer_address,
            original_portfolio_value_in_octa: aptos_amount_to_swap,
            target_weights: v,
            signer_capability:vault_signer_cap
        };
        table::upsert(&mut user.rebalancer_baskets,counter,new_basket);
        user.rebalancer_baskets_count = counter;

    }

    public entry fun rebalance_portfolio(creator_addr:address,id:u64,_cur_usdt_market_value:u64, _cur_btc_market_value: u64) acquires User{

        let creator = borrow_global_mut<User>(creator_addr);
        let creator_rebalancer_basket = table::borrow_mut(&mut creator.rebalancer_baskets, id);
        let _resource_account_from_cap = account::create_signer_with_capability(&creator_rebalancer_basket.signer_capability);

        //Derive current weight allocation

        let _target_usdt_weight = *vector::borrow(&creator_rebalancer_basket.target_weights, 0);
        let _target_btc_weight = *vector::borrow(&creator_rebalancer_basket.target_weights, 1);  
    }


}