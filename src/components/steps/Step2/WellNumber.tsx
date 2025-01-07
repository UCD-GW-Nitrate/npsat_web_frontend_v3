import { Card } from 'antd';
import { useEffect, useState } from 'react';

import { useGetWellsQuery } from '@/store';
import type { WellRequest } from '@/types/well/Well';
import { REGION_MACROS } from '@/utils/constants';

interface WellNumberProps {
  selectedRegions: number[];
  wellParams: Partial<WellRequest>;
  mapType: number;
}

const WellNumber = ({
  selectedRegions,
  wellParams,
  mapType,
}: WellNumberProps) => {
  const { data: wellData, isLoading } = useGetWellsQuery(wellParams);

  function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const [displayData, setDisplayData] = useState<string>('0');

  useEffect(() => {
    if (selectedRegions.length === 0) {
      setDisplayData('0');
    } else if (isLoading) {
      setDisplayData('');
    } else {
      setDisplayData(numberWithCommas(wellData?.count ?? 0));
    }
  }, [wellData]);

  return (
    <div>
      <Card>
        Number of Wells Selected:{' '}
        {mapType === REGION_MACROS.CENTRAL_VALLEY && selectedRegions.length > 0
          ? numberWithCommas(wellData?.count ?? 0)
          : displayData}
      </Card>
    </div>
  );
};

export default WellNumber;
