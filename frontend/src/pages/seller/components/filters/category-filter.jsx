import useRouter from '@/hooks/useRouter';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect, Fragment } from 'react';
import { getCategories } from '../../api/apiService';

export function CategoryFilter() {
  const [categories, setCategories] = useState([]);
  const { searchParams, navigate, location } = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      setCategories((await getCategories()).map((c) => c.name));
    }
    
    fetchCategories();
  }, []);

  const handleChange = (value) => {
    value ? searchParams.set('categoryName', value) : searchParams.delete('categoryName');
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  return <div className="mt-4">
    <div className="flex justify-between items-center">
      <h3 className="font-semibold mb-2">Categories</h3>
      {searchParams.get('categoryName') &&
        <Label
          className="cursor-pointer underline font-normal h-[24px]"
          onClick={() => handleChange(null)}
        >
          Clear
        </Label>
      }
    </div>
    <RadioGroup value={searchParams.get('categoryName')} onValueChange={handleChange}>
      <div className="space-y-2">
        {categories.map((value, index) => (
          <Fragment key={index}>
            <div className="flex items-center">
              <RadioGroupItem value={value} id={index} />
              <Label className="ml-2">{value}</Label>
            </div>
          </Fragment>)
        )}
      </div>
    </RadioGroup>
  </div>
}