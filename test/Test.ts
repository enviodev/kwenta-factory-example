import assert = require("assert")
import { MockDb, FuturesMarket } from "../generated/src/TestHelpers.gen";
import {
  EventsSummaryEntity,
  FuturesMarket_CacheUpdatedEntity,
} from "../generated/src/Types.gen";

import { Addresses } from "../generated/src/bindings/Ethers.bs";

import { GLOBAL_EVENTS_SUMMARY_KEY } from "../src/EventHandlers";


const MOCK_EVENTS_SUMMARY_ENTITY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  futuresMarket_CacheUpdatedCount: BigInt(0),
  futuresMarket_FundingRecomputedCount: BigInt(0),
  futuresMarket_FuturesTrackingCount: BigInt(0),
  futuresMarket_MarginTransferredCount: BigInt(0),
  futuresMarket_NextPriceOrderRemovedCount: BigInt(0),
  futuresMarket_NextPriceOrderSubmittedCount: BigInt(0),
  futuresMarket_PositionLiquidatedCount: BigInt(0),
  futuresMarket_PositionModifiedCount: BigInt(0),
  futuresMarketManager_MarketAddedCount: BigInt(0),
};

describe("FuturesMarket contract CacheUpdated event tests", () => {
  // Create mock db
  const mockDbInitial = MockDb.createMockDb();

  // Add mock EventsSummaryEntity to mock db
  const mockDbFinal = mockDbInitial.entities.EventsSummary.set(
    MOCK_EVENTS_SUMMARY_ENTITY
  );

  // Creating mock FuturesMarket contract CacheUpdated event
  const mockFuturesMarketCacheUpdatedEvent = FuturesMarket.CacheUpdated.createMockEvent({
    name: "foo",
    destination: Addresses.defaultAddress,
    mockEventData: {
      chainId: 1,
      blockNumber: 0,
      blockTimestamp: 0,
      blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      srcAddress: Addresses.defaultAddress,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      transactionIndex: 0,
      logIndex: 0,
    },
  });

  // Processing the event
  const mockDbUpdated = FuturesMarket.CacheUpdated.processEvent({
    event: mockFuturesMarketCacheUpdatedEvent,
    mockDb: mockDbFinal,
  });

  it("FuturesMarket_CacheUpdatedEntity is created correctly", () => {
    // Getting the actual entity from the mock database
    let actualFuturesMarketCacheUpdatedEntity = mockDbUpdated.entities.FuturesMarket_CacheUpdated.get(
      mockFuturesMarketCacheUpdatedEvent.transactionHash +
        mockFuturesMarketCacheUpdatedEvent.logIndex.toString()
    );

    // Creating the expected entity
    const expectedFuturesMarketCacheUpdatedEntity: FuturesMarket_CacheUpdatedEntity = {
      id:
        mockFuturesMarketCacheUpdatedEvent.transactionHash +
        mockFuturesMarketCacheUpdatedEvent.logIndex.toString(),
      name: mockFuturesMarketCacheUpdatedEvent.params.name,
      destination: mockFuturesMarketCacheUpdatedEvent.params.destination,
      eventsSummary: "GlobalEventsSummary",
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualFuturesMarketCacheUpdatedEntity, expectedFuturesMarketCacheUpdatedEntity, "Actual FuturesMarketCacheUpdatedEntity should be the same as the expectedFuturesMarketCacheUpdatedEntity");
  });

  it("EventsSummaryEntity is updated correctly", () => {
    // Getting the actual entity from the mock database
    let actualEventsSummaryEntity = mockDbUpdated.entities.EventsSummary.get(
      GLOBAL_EVENTS_SUMMARY_KEY
    );

    // Creating the expected entity
    const expectedEventsSummaryEntity: EventsSummaryEntity = {
      ...MOCK_EVENTS_SUMMARY_ENTITY,
      futuresMarket_CacheUpdatedCount: MOCK_EVENTS_SUMMARY_ENTITY.futuresMarket_CacheUpdatedCount + BigInt(1),
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualEventsSummaryEntity, expectedEventsSummaryEntity, "Actual FuturesMarketCacheUpdatedEntity should be the same as the expectedFuturesMarketCacheUpdatedEntity");
  });
});
