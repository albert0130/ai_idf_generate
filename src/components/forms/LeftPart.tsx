'use client'

import React, { useState, useRef, useEffect } from 'react';
import { IDFData } from '@/types/idf';
import { generatePDF } from '@/utils/pdf';
import { useIDFData } from '@/hooks/useIDFData';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EditableField from '@/components/ui/EditableField';
import AIAssistButton from '@/components/ui/AIAssistButton';
import InventorTable from '@/components/forms/InventorTable';
import InventionSection from '@/components/forms/InventionSection';
import DataTable from '@/components/forms/DataTable';
import { PriorArtItem, DisclosureItem, PublicationPlan } from '@/types/idf';

interface LeftPartProps {
  message: any;
  setMessage: (value: any) => void;
}

export default function LeftPart({ message, setMessage }: LeftPartProps) {
  const [title, setTitle] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const {
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
  } = useIDFData();

  // Handle result from RightPart
  useEffect(() => {
    if (message.result && message.item === 'prior_art') {
      updatePriorArt(message.result);
      setMessage({}); // Clear the message to hide right panel
    }
  }, [message.result, message.item, updatePriorArt, setMessage]);

  const handlePriorArtScrape = () => {
    setMessage({
      title: idfData.invention.description,
      item: 'prior_art',
      current: idfData.invention.keywords,
      result: null
    });
  };

  const handleDownload = async () => {
    if (!contentRef.current) return;

    // Change styles for PDF generation
    const elements = contentRef.current.querySelectorAll('.exclude-from-pdf');
    var originalStyles : any;

    elements.forEach((elem) => {
      if (elem instanceof HTMLElement) {
        originalStyles.push({
          color : elem.style.color,
          backgroundColor: elem.style.backgroundColor,
        });
        elem.style.display = 'none';
      }
    });

    // Generate PDF
    await generatePDF(idfData);

    // Restore styles
    elements.forEach((elem, index) => {
      if (elem instanceof HTMLElement) {
        elem.style.display = '';
        if (originalStyles[index]) {
          elem.style.color = originalStyles[index].color;
          elem.style.backgroundColor = originalStyles[index].backgroundColor;
        }
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-8 font-sans bg-gray-50 min-h-screen">
      <header className="mb-10 exclude-from-pdf">
        <h1 className="text-4xl font-extrabold text-blue-700 text-center">Invention Disclosure Form</h1>
        <p className="text-center text-gray-600 mt-2 text-sm">
          Please complete the form with accurate and detailed information.
        </p>
      </header>

      <section className="bg-white rounded-xl shadow-lg p-6 space-y-8">
        <div ref={contentRef} id="content">
          {/* Title + Generate Button */}
          <div className="flex flex-col md:flex-row gap-4 exclude-from-pdf">
            <input
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Input description of Invention"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>

          {idfData && (
            <div className="space-y-6 text-sm">
              {/* Header Banner */}
              <div className="rounded overflow-hidden shadow">
                <div className="bg-blue-500 text-gray-800 text-center text-xs py-1 font-medium">
                  "Hospital Name" Medical Research, Infrastructure & Services Ltd.
                </div>
                <div className="bg-blue-400 text-gray-800 text-center text-lg font-semibold py-2 tracking-wide">
                  INVENTION DISCLOSURE FORM (IDF)
                </div>
                <div className="bg-yellow-300 p-4 text-gray-900 border-t border-white exclude-from-pdf">
                  <strong>INSTRUCTIONS:</strong> Complete this form <strong>in full, dated</strong> and <strong>signed</strong>. Email to IP Manager at:
                </div>
              </div>

              {loading ? (
                <LoadingSpinner size="lg" text="Loading, please wait..." />
              ) : null}

              {/* 1. Date */}
              <div className="flex items-center gap-4 mb-4">
                <label className="w-24 text-sm font-medium text-gray-700" htmlFor="date">1. DATE</label>
                <input
                  id="date"
                  type="date"
                  className="flex-1 px-4 py-2 no-border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={idfData.date}
                  onChange={(e) => updateIDFData({ date: e.target.value })}
                />
              </div>

              {/* 2. Title */}
              <div className="flex items-center gap-4 mb-4">
                <label htmlFor="title" className="w-24 text-sm font-medium text-gray-700">2. TITLE</label>
                <input
                  id="title"
                  type="text"
                  className="flex-1 px-4 py-2 no-border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={idfData.invention.additionaldata}
                  value={idfData.title}
                  onChange={(e) => updateIDFData({ title: e.target.value })}
                />
                <AIAssistButton
                  onClick={() => handleUpdateOne('title')}
                  loading={updatingField === 'title'}
                />
              </div>

              {/* 3. Inventor Table */}
              <InventorTable
                inventors={idfData.inventors}
                onUpdateInventors={updateInventors}
              />

              {/* 4. ABSTRACT OF THE INVENTION */}
              <div>
                <strong className="block text-lg font-semibold text-gray-800 mb-2">4. ABSTRACT OF THE INVENTION:</strong>
                <EditableField
                  value={idfData.abstract}
                  onChange={(value) => updateIDFData({ abstract: value })}
                  placeholder="TO BE COMPLETED AFTER FILLING IN THE FORM. Include the need and the proposed solution to said need"
                />
                <div className="mt-2 flex justify-start">
                  <AIAssistButton
                    onClick={() => handleUpdateOne('abstract')}
                    loading={updatingField === 'abstract'}
                  />
                </div>
              </div>

              {/* 5. THE INVENTION */}
              <InventionSection
                invention={idfData.invention}
                onUpdateInvention={updateInvention}
                onUpdateField={handleUpdateOne}
                updatingField={updatingField}
              />

              {/* 6. PRIOR ART */}
              <DataTable<PriorArtItem>
                title="6. PRIOR ART"
                data={idfData.prior_art}
                columns={['title', 'authors', 'published', 'PublicationDate']}
                onUpdateData={updatePriorArt}
                onGenerateAI={handlePriorArtScrape}
                loading={updatingField === 'prior_art'}
                emptyMessage="None known"
              />

              {/* 7. DISCLOSURE */}
              <DataTable<DisclosureItem>
                title="7. DISCLOSURE"
                data={idfData.disclosure}
                columns={['title', 'authors', 'published', 'Date']}
                onUpdateData={updateDisclosure}
                onGenerateAI={() => handleUpdateOne('disclosure')}
                loading={updatingField === 'disclosure'}
                emptyMessage="Not Disclosed"
              />

              {/* 8. PUBLICATION PLANS */}
              <DataTable<PublicationPlan>
                title="8. PUBLICATION PLANS"
                data={idfData.plans}
                columns={['title', 'authors', 'disclosed', 'Date']}
                onUpdateData={updatePlans}
                onGenerateAI={() => handleUpdateOne('plans')}
                loading={updatingField === 'plans'}
                emptyMessage="No"
              />

              {/* Download Button */}
              <div className="text-center exclude-from-pdf flex justify-between">
                <button
                  className="bg-gray-300 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-md shadow transition"
                  onClick={handleDownload}
                >
                  Download PDF
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-md shadow transition exclude-from-pdf"
                  onClick={() => handleGenerate(title)}
                >
                  {loading ? "generating..." : "generate all answers in one time"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 