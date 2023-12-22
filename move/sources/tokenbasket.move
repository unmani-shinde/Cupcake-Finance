// defining the move module
module tokenbasket_addr::tokenbasket {

    // Errors
    const E_NOT_INITIALIZED: u64 = 1;
    const ETOKEN_BASKET_IS_DYNAMIC: u64 = 2;

    // Importing the required types
    use aptos_framework::event;
    use aptos_framework::account;
    use std::string::{String,utf8};
    use std::signer;
    use aptos_std::table::{Self, Table};

    // use pyth::pyth;
    // use pyth::price::Price;
    // use pyth::price_identifier;

    // use aptos_framework::aptos_coin::AptosCoin;
    // use aptos_framework::coin;

    // // Test BTC
    // use 0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::BTC;

    // // Test ETH
    // use test_coins_extended::coins_extended::ETH;

    // // Test USDT
    // use 0x43417434fd869edee76cca2a4d2301e528a1551b1d719b75c350c3c97d15b8b9::coins::USDT;

    // aptos_amount_to_swap_for_usdt... -> multiply total amount in token basket and the ratio of the token -> return this from a function  
    // include coins inside token?... ->
    // basic oracle?... -> xxx
    // returning a value from a function -> event.emit?


    // creating the TokenBasket Struct
    struct TokenBasket has key {
        tokens: Table<u64, Token>,
        set_token_event: event::EventHandle<Token>,
        token_amount: u64,
        token_count: u64,
        dynamic: bool,
        // token_count: u64
    }

    // creating the Token Strcut
    struct Token has store, drop, copy {
        address:address,
        name: String,
        ratio: u64
    }

    // function to create a new token basket
    public entry fun create_basket(account: &signer){
        let tokens_holder = TokenBasket {
            tokens: table::new(),
            set_token_event: account::new_event_handle<Token>(account),
            token_amount: 0,
            token_count: 0,
            dynamic: false,
            // token_count: 0
        };
        // move the TokenBasket resource under the signer account
        move_to(account, tokens_holder);
        }

    // function to create a token to the token basket
    public entry fun create_token(account: &signer, name: String, ratio:u64) acquires TokenBasket {
        // gets the signer address
        let signer_address = signer::address_of(account);
        // assert signer has created a toekn basket
        assert!(exists<TokenBasket>(signer_address), E_NOT_INITIALIZED);
        // gets the TokenBasket resource
        let token_basket = borrow_global_mut<TokenBasket>(signer_address);
         // increment token count
        // let count = token_basket.token_count + 1;
        // assign token_number based on name
        let token_number = 1;
        if (name == utf8(b"ETH")) {
            token_number = 2;
        } else if (name == utf8(b"BTC")) {
            token_number = 3;
        }
        else if (name == utf8(b"USDT")) {
            token_number = 4;
        };
        // creates a new token
        let new_token = Token {
        address: signer_address,
        name: name,
        ratio: ratio
        };
        // adds the new token into the tokens table
        table::upsert(&mut token_basket.tokens, token_number, new_token);
        // sets the token count to be the incremented count
        // token_basket.token_count = count;
        // fires a new token created event
        event::emit_event<Token>(
        &mut borrow_global_mut<TokenBasket>(signer_address).set_token_event,
        new_token,
        );
    }

    // function to add amount to the basket
    public entry fun add_amount(account: &signer, amount: u64) acquires TokenBasket {
        // gets the signer address
        let signer_address = signer::address_of(account);
        // assert signer has created a token basket
        assert!(exists<TokenBasket>(signer_address), E_NOT_INITIALIZED);
        // get TokenBasket resource
        let token_basket = borrow_global_mut<TokenBasket>(signer_address);
        // adds the amount to the token basket
        token_basket.token_amount = token_basket.token_amount+amount;
    }

    // function to update dynamic status
    public entry fun update_status(account: &signer, status: bool) acquires TokenBasket {
        // gets the signer address
        let signer_address = signer::address_of(account);
        // assert signer has created a token basket
        assert!(exists<TokenBasket>(signer_address), E_NOT_INITIALIZED);
        // get TokenBasket resource
        let token_basket = borrow_global_mut<TokenBasket>(signer_address);
        // assert token basket is not dynamic
        assert!(token_basket.dynamic == false, ETOKEN_BASKET_IS_DYNAMIC);
        token_basket.dynamic = status;
    }

}
