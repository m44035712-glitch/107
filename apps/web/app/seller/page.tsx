"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { apiClient } from "@bis/api-client";

const products = [
  "Cement",
  "Electric Iron",
  "Washing Machine",
  "Packaged Drinking Water",
  "Gold Jewellery",
];

type CatalogResult = {
  product: string;
  standardNumber: string;
  title: string;
  category: string;
  status: string;
  sourceUrl: string;
  excerpt: string;
};

function getWorkbookField(excerpt: string, field: string): string {
  const line = excerpt.split(/\r?\n/).find((item) => item.toLowerCase().startsWith(`${field.toLowerCase()}:`));
  return line ? line.slice(field.length + 1).trim() : "";
}

export default function SellerPage() {
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [productName, setProductName] = useState("");
  const [results, setResults] = useState<CatalogResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<CatalogResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const findApplicableStandards = async (product: string) => {
    setProductName(product);
    setSelectedResult(null);
    setIsLoading(true);
    setError("");
    try {
      const response = await apiClient.searchKnowledgeDocuments({ query: product, topK: 10 });
      const mapped = response.results
        .filter((result) => result.standardNumber && result.standardNumber !== "UNSPECIFIED")
        .map((result) => ({
          product: getWorkbookField(result.excerpt, "Product") || product,
          standardNumber: result.standardNumber,
          title: getWorkbookField(result.excerpt, "Title") || result.documentTitle,
          category: getWorkbookField(result.excerpt, "Category") || "BIS Standard",
          status: getWorkbookField(result.excerpt, "Status") || result.status,
          sourceUrl: getWorkbookField(result.excerpt, "Source URL") || result.sourceUrl,
          excerpt: result.excerpt,
        }));
      setResults(mapped.filter((result, index, list) => list.findIndex((item) => item.standardNumber === result.standardNumber) === index));
    } catch (requestError) {
      setResults([]);
      setError(requestError instanceof Error ? requestError.message : "Unable to load BIS standards.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#05072e] px-4 py-8 text-[#CAF0F8] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#48CAE4] transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <section className="mt-8 rounded-3xl border border-[#ADE8F4] bg-[#FFFFFF] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.28)] sm:p-10">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black">Product Seller</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-black sm:text-4xl">Find the right Indian Standard</h1>
            <p className="mt-3 text-sm leading-relaxed text-black">Choose a product to find applicable BIS standards, certification requirements, and testing guidance.</p>
          </div>

          <button type="button" onClick={() => setShowProductPicker(true)} className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#0077B6] px-5 py-3 text-xs font-bold text-white shadow-md shadow-[#0077B6]/20 transition hover:bg-[#023E8A]">
            <Search className="h-4 w-4" /> Find Applicable IS Standard
          </button>

          <section className="mt-12 border-t border-[#ADE8F4] pt-8">
            <h2 className="text-xl font-bold text-white">How can we help you?</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <Link href="/standards/recommend" className="rounded-xl border border-[#ADE8F4] bg-[#03045E] p-4 text-left transition hover:border-[#0077B6] hover:bg-[#03045E]">
                <p className="text-sm font-bold text-[#CAF0F8]">🔎 Find by Product</p>
                <p className="mt-2 text-xs leading-relaxed text-[#ADE8F4]">Search for the applicable Indian Standard using your product.</p>
              </Link>
              <Link href="/standards" className="rounded-xl border border-[#ADE8F4] bg-[#03045E] p-4 text-left transition hover:border-[#0077B6] hover:bg-[#03045E]">
                <p className="text-sm font-bold text-[#CAF0F8]">📋 Know your IS Number</p>
                <p className="mt-2 text-xs leading-relaxed text-[#ADE8F4]">Already know your IS number? Search it directly.</p>
              </Link>
              <Link href="/chat" className="rounded-xl border border-[#ADE8F4] bg-[#03045E] p-4 text-left transition hover:border-[#0077B6] hover:bg-[#03045E]">
                <p className="text-sm font-bold text-[#CAF0F8]">🤖 Ask AI Guide</p>
                <p className="mt-2 text-xs leading-relaxed text-[#ADE8F4]">Get guidance on standards, certification and testing.</p>
              </Link>
            </div>
          </section>

          {showProductPicker && (
            <div className="mt-8 max-w-2xl border-t border-[#ADE8F4] pt-6">
              <label htmlFor="product-name" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#6582a2]">Enter your product name</label>
              <div className="relative">
                <input id="product-name" value={productName} onChange={(event) => setProductName(event.target.value)} placeholder="Enter your product name" className="w-full rounded-lg border border-[#ADE8F4] bg-[#03045E] px-3 py-3 pr-28 text-sm text-[#CAF0F8] outline-none transition placeholder:text-[#6582a2] focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/30" />
                <button type="button" onClick={() => void findApplicableStandards(productName.trim())} disabled={!productName.trim() || isLoading} className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center gap-2 rounded-md bg-[#0077B6] px-3 py-2 text-xs font-bold text-white shadow-md shadow-[#0077B6]/20 transition hover:bg-[#023E8A] disabled:cursor-not-allowed disabled:opacity-50">
                  <Search className="h-4 w-4" /> Search
                </button>
              </div>
              <p className="mb-3 mt-6 text-[10px] font-bold uppercase tracking-[0.1em] text-[#6582a2]">Products</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {products.map((product) => (
                  <button key={product} type="button" onClick={() => void findApplicableStandards(product)} className="rounded-xl border border-[#ADE8F4] bg-[#03045E] px-4 py-3 text-left text-sm font-semibold text-[#6582a2] transition hover:border-[#0077B6] hover:bg-[#03045E]">
                    {product}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && <p className="mt-8 text-sm text-[#ADE8F4]">Searching the BIS RAG knowledge base...</p>}
          {error && <p className="mt-8 rounded-lg border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
          {!isLoading && results.length > 0 && (
            <div className="mt-8 overflow-x-auto rounded-2xl border border-[#ADE8F4]">
              <table className="w-full min-w-[850px] text-left text-xs">
                <thead className="bg-[#03045E] text-[10px] uppercase tracking-[0.12em] text-[#ADE8F4]">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">IS Number</th>
                    <th className="px-4 py-3">Standard Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Standard Status</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ADE8F4]">
                  {results.map((result) => (
                    <tr key={result.standardNumber} className="bg-[#FFFFFF] text-[#6582a2]">
                      <td className="px-4 py-3 font-semibold">{result.product}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-bold text-[#48CAE4]">{result.standardNumber}</td>
                      <td className="max-w-[260px] px-4 py-3">{result.title}</td>
                      <td className="px-4 py-3">{result.category}</td>
                      <td className="px-4 py-3">{result.status}</td>
                      <td className="px-4 py-3"><a href={result.sourceUrl} target="_blank" rel="noreferrer" className="text-[#48CAE4] hover:underline">BIS Source</a></td>
                      <td className="px-4 py-3"><button type="button" onClick={() => setSelectedResult(result)} className="whitespace-nowrap rounded-lg bg-[#0077B6] px-3 py-2 text-[10px] font-bold text-white transition hover:bg-[#023E8A]">View Details</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedResult && (
            <div className="mt-6 rounded-2xl border border-[#0077B6]/50 bg-[#03045E] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#48CAE4]">Standard Details</p>
              <h2 className="mt-2 text-xl font-bold text-white">{selectedResult.title}</h2>
              <p className="mt-2 text-sm text-[#ADE8F4]">{selectedResult.excerpt}</p>
              <Link href={`/laboratories?std=${encodeURIComponent(selectedResult.standardNumber)}&product=${encodeURIComponent(selectedResult.product)}`} className="mt-5 inline-flex rounded-lg bg-[#0077B6] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#023E8A]">Suggested Laboratory to Verify Product</Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
