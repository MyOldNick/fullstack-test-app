import InfiniteScroll from 'react-infinite-scroll-component';
import type { Solution } from '../common/types';
import SolutionCard from './SolutionCard';

type ComponentProps = {
  history: Array<Solution>;
  getHistory: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
};

function History({ history, getHistory, hasMore, loading }: ComponentProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h1 className="font-bold text-2xl">History</h1>
      {loading ? <p>Loading...</p> : !history.length && <p>You don't have history</p>}
      <InfiniteScroll
        dataLength={history.length}
        next={getHistory}
        hasMore={hasMore}
        loader={<p>Loading...</p>}
      >
        {history.map((solution) => (
          <div key={solution.id} className="mb-6">
            <SolutionCard solution={solution} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default History;
