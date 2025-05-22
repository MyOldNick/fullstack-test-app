import { StatusEnum } from '../common/enums';
import type { Solution } from '../common/types';

function SolutionCard({ solution }: { solution: Solution }) {
  return (
    <div className="p-2 border border-gray-300 rounded-md w-[550px]">
      <h2>
        <span className="font-bold">Description</span>: {solution.description}
      </h2>
      <p>
        <span className="font-bold">Solution</span>: {solution.solution}
      </p>
      {solution.reason && (
        <p>
          <span className="font-bold">Reason</span>: {solution.reason}
        </p>
      )}
      <p>
        <span className="font-bold">Status</span>:{' '}
        <span
          className={`capitalize ${solution.status === StatusEnum.PENDING ? 'text-yellow-500' : solution.status === StatusEnum.ANALYZED ? 'text-green-500' : 'text-red-500'}`}
        >
          {solution.status}
        </span>
      </p>
      {solution.analyze && (
        <div className="flex mt-4">
          <p className="min-w-2/6 font-bold">Result of the analysis:</p>
          <div className="text-sm">
            <p>
              <span className="font-bold">Category</span>: {solution.analyze.category}
            </p>
            <p>
              <span className="font-bold">Distortions</span>: {solution.analyze.distortions}
            </p>
            <p>
              <span className="font-bold">Alternative</span>: {solution.analyze.alternative}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SolutionCard;
