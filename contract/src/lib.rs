use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedSet, UnorderedMap, LookupMap, LookupSet, Vector, TreeMap};
use near_sdk::json_types::U128;
use near_sdk::serde::Serialize;
use near_sdk::{near_bindgen, AccountId, PanicOnDefault, env, Balance};

#[derive(Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Info {
	pub gas: U128,
	pub storage: U128,
}

#[near_bindgen]
#[derive(PanicOnDefault, BorshDeserialize, BorshSerialize)]
pub struct Storage {
	/*
		Maps
	*/
	pub lookup_map: LookupMap<AccountId, String>,
	pub unordered_map: UnorderedMap<AccountId, String>,
	pub tree_map: TreeMap<AccountId, String>,
	
	/*
		Sets
	*/
	pub lookup_set: LookupSet<AccountId>,
	pub unordered_set: UnorderedSet<AccountId>,
	pub vector: Vector<AccountId>
}

#[near_bindgen]
impl Storage {

	/// Initialize the contract with default collections
	#[init]
	pub fn new() -> Self {
		Self { 
			lookup_map: LookupMap::new(b"a"),
			unordered_map: UnorderedMap::new(b"b"),
			tree_map: TreeMap::new(b"c"),
			lookup_set: LookupSet::new(b"d"),
			unordered_set: UnorderedSet::new(b"e"),
			vector: Vector::new(b"f"),
		}
	}

	/// Add key-value pair to a specified map and return how much GAS was burnt
	pub fn add_to_map(&mut self, storage_type: String, key: AccountId, value: String) -> Info {
		let initial_storage = env::storage_usage();
		let initial_gas = env::used_gas();
		match storage_type.as_str() {
			"lookup" => {
				self.lookup_map.insert(&key, &value);
			},
			"unordered" => {
				self.unordered_map.insert(&key, &value);
			},
			"tree" => {
				self.tree_map.insert(&key, &value);
			}
			_ => env::panic_str("invalid storage type")
		}
		let final_gas = env::used_gas();
		let final_storage = env::storage_usage();
		let total_required_storage = Balance::from(final_storage - initial_storage) * env::storage_byte_cost();
		Info {
			gas: U128((final_gas.0 - initial_gas.0).into()),
			storage: U128(total_required_storage)
		}		
	}

	/// Add value to a specified set and return how much GAS was burnt
	pub fn add_to_set(&mut self, storage_type: String, value: AccountId) -> Info {
		let initial_storage = env::storage_usage();
		let initial_gas = env::used_gas();
		match storage_type.as_str() {
			"lookup" => {
				self.lookup_set.insert(&value);
			},
			"unordered" => {
				self.unordered_set.insert(&value);
			},
			"vector" => {
				self.vector.push(&value);
			}
			_ => env::panic_str("invalid storage type")
		}
		let final_gas = env::used_gas();
		let final_storage = env::storage_usage();
		let total_required_storage = Balance::from(final_storage - initial_storage) * env::storage_byte_cost();
		Info {
			gas: U128((final_gas.0 - initial_gas.0).into()),
			storage: U128(total_required_storage)
		}	
	}

	///get the value from a specified map and return how much GAS was burnt
	pub fn get_from_map(&mut self, storage_type: String, key: AccountId) -> Info {
		let initial_gas = env::used_gas();
		match storage_type.as_str() {
			"lookup" => {
				self.lookup_map.get(&key);
			},
			"unordered" => {
				self.unordered_map.get(&key);
			},
			"tree" => {
				self.tree_map.get(&key);
			}
			_ => env::panic_str("invalid storage type")
		}
		let final_gas = env::used_gas();
		Info {
			gas: U128((final_gas.0 - initial_gas.0).into()),
			storage: U128(0)
		}	
	}

	/// check the value in a specified set and return how much GAS was burnt
	pub fn get_from_set(&mut self, storage_type: String, value: AccountId, index: Option<u64>) -> Info {
		let initial_gas = env::used_gas();
		match storage_type.as_str() {
			"lookup" => {
				self.lookup_set.contains(&value);
			},
			"unordered" => {
				self.unordered_set.contains(&value);
			},
			"vector" => {
				self.vector.get(index.unwrap());
			}
			_ => env::panic_str("invalid storage type")
		}
		let final_gas = env::used_gas();
		Info {
			gas: U128((final_gas.0 - initial_gas.0).into()),
			storage: U128(0)
		}	
	}
}