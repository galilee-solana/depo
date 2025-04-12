#[cfg(test)]
pub mod mocks {
    use crate::states::EscrowContext;

    pub struct MockEscrow {
        pub balance: u64
    }

    impl EscrowContext for MockEscrow {
        fn lamports(&self) -> u64 {
            self.balance
        }
    }

}
