import { useState, useCallback } from 'react';
import { IDFData, defaultIDFData, isTableSectionKey } from '@/types/idf';
import { generateIDFData } from '@/services/api';
import generateusingperplexity from '@/services/api';

export function useIDFData() {
  const [idfData, setIdfData] = useState<IDFData>(defaultIDFData);
  const [loading, setLoading] = useState(false);
  const [updatingField, setUpdatingField] = useState<string | null>(null);

  const handleGenerate = useCallback(async (title?: string) => {
    const description = title || idfData.invention.description;
    if (!description) return;
    
    setLoading(true);
    try {
      const generatedData = await generateIDFData(description);
      
      // Preserve existing uploaded images when generating all data
      const existingImages = idfData.invention.uploadedImages || [];
      
      if (existingImages.length > 0) {
        // Merge generated data with existing images
        const mergedData = {
          ...generatedData,
          invention: {
            ...generatedData.invention,
            uploadedImages: existingImages
          }
        };
        setIdfData(mergedData);
      } else {
        setIdfData(generatedData);
      }
    } catch (error) {
      console.error('Failed to generate IDF data:', error);
    } finally {
      setLoading(false);
    }
  }, [idfData.invention.description, idfData.invention.uploadedImages]);

  const handleUpdateOne = useCallback(async (item: keyof IDFData | keyof IDFData['invention']) => {
    if (!idfData.invention.description) return;
    
    setUpdatingField(item);
    try {
      const result = await generateusingperplexity(
        idfData.invention.description,
        item,
        idfData.invention.keywords ? idfData.invention.keywords.toString() : ''
      );

      const updated = { ...idfData };

      if (isTableSectionKey(item as keyof IDFData)) {
        // Handle table sections (prior_art, disclosure, plans)
        try {
          const parsedResult = JSON.parse(result);
          (updated[item as keyof IDFData] as any) = parsedResult;
        } catch (e) {
          console.error('Failed to parse table data:', e);
        }
      } else if (item === 'title' || item === 'abstract') {
        // Handle top-level fields
        (updated[item] as string) = result;
      } else {
        // Handle invention fields
        const fieldsToArray = ['keywords', 'results', 'components'] as (keyof IDFData['invention'])[];
        if (fieldsToArray.includes(item as keyof IDFData['invention'])) {
          (updated.invention[item as keyof IDFData['invention']] as string[]) = result.split(',').map((v: string) => v.trim());
        } else if (item === 'additionaldata') {
          // Process AI result for additional data (text only)
          const aiResult = result.trim();
          
          console.log('AI result for additionaldata:', aiResult);
          
          // Only update if AI returned meaningful data
          if (aiResult && 
              aiResult !== 'null' && 
              aiResult !== 'undefined' && 
              aiResult !== '' && 
              aiResult !== 'none' &&
              aiResult !== 'N/A' &&
              aiResult !== 'n/a' &&
              aiResult !== 'No additional data available' &&
              aiResult !== 'No additional data' &&
              aiResult !== 'None') {
            
            console.log('Setting additionaldata to:', aiResult);
            (updated.invention[item as keyof IDFData['invention']] as string) = aiResult;
          } else {
            console.log('AI returned empty data for additionaldata, keeping existing data');
            // Keep existing additionaldata if AI returned empty
          }
          
          // Images are stored separately in uploadedImages field, so they're preserved automatically
          console.log('Images preserved in uploadedImages:', updated.invention.uploadedImages);
        } else {
          (updated.invention[item as keyof IDFData['invention']] as string) = result;
        }
      }

      setIdfData(updated);
    } catch (error) {
      console.error('Failed to update field:', error);
    } finally {
      setUpdatingField(null);
    }
  }, [idfData.invention.description, idfData.invention.keywords]);

  const updateIDFData = useCallback((newData: Partial<IDFData>) => {
    setIdfData(prev => ({ ...prev, ...newData }));
  }, []);

  const updateInvention = useCallback((invention: IDFData['invention']) => {
    setIdfData(prev => ({ ...prev, invention }));
  }, []);

  const updateInventors = useCallback((inventors: IDFData['inventors']) => {
    setIdfData(prev => ({ ...prev, inventors }));
  }, []);

  const updatePriorArt = useCallback((prior_art: IDFData['prior_art']) => {
    setIdfData(prev => ({ ...prev, prior_art }));
  }, []);

  const updateDisclosure = useCallback((disclosure: IDFData['disclosure']) => {
    setIdfData(prev => ({ ...prev, disclosure }));
  }, []);

  const updatePlans = useCallback((plans: IDFData['plans']) => {
    setIdfData(prev => ({ ...prev, plans }));
  }, []);

  return {
    idfData,
    loading,
    updatingField,
    handleGenerate,
    handleUpdateOne,
    updateIDFData,
    updateInvention,
    updateInventors,
    updatePriorArt,
    updateDisclosure,
    updatePlans,
  };
} 