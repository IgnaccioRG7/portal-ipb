import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Worker (mínimo indispensable para que funcione)
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function PdfViewer({ url, titulo }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [baseWidth, setBaseWidth] = useState(1080);


  /* ================= PROTECCIONES ================= */

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && ['s', 'p'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      alert('Acción deshabilitada');
    }
  };

  /* ================= PDF ================= */

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error(err);
    setError('No se pudo cargar el documento');
    setLoading(false);
  };

  /* ================= CONTROLES ================= */

  const prevPage = () => setPageNumber(p => Math.max(p - 1, 1));
  const nextPage = () => setPageNumber(p => Math.min(p + 1, numPages ?? 1));
  const zoomIn = () =>
    setScale(s => Math.min(s + 0.2, MAX_SCALE));

  const zoomOut = () =>
    setScale(s => Math.max(s - 0.2, MIN_SCALE));

  const resetZoom = () => setScale(1);

  const MAX_WIDTH = 1080;
  const MIN_SCALE = 0.8;
  const MAX_SCALE = 2.2;

  useEffect(() => {
    const calculateWidth = () => {
      if (!containerRef.current) return;

      const availableWidth =
        containerRef.current.clientWidth - 32;

      setBaseWidth(Math.min(availableWidth, MAX_WIDTH));
    };

    calculateWidth();
    window.addEventListener('resize', calculateWidth);

    return () => window.removeEventListener('resize', calculateWidth);
  }, []);

  return (
    <div
      className="flex flex-col h-full outline-none bg-gray-900"
      tabIndex={0}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      onKeyDown={handleKeyDown}
    >
      {/* ===== HEADER (solo título) ===== */}
      <div className="bg-gray-800 text-white px-6 py-3 flex items-center sticky top-0 z-10">
        <h3 className="font-semibold truncate">{titulo}</h3>
      </div>

      {/* ===== VISOR ===== */}
      <div
        ref={containerRef}
        className="flex-1 pdf-viewer-container overflow-auto flex justify-center py-6"
      >
        <div className="w-full max-w-[1080px] flex justify-center">

          {loading && (
            <div className="text-white loading-pulse">
              Cargando documento…
            </div>
          )}

          {error && (
            <div className="text-red-400 font-semibold">
              {error}
            </div>
          )}

          {!error && (
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading=""
              error=""
            >
              <Page
                pageNumber={pageNumber}
                width={baseWidth * scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="pdf-page-protected shadow-2xl"
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
              />
            </Document>
          )}

          {/* ===== MARCA DE AGUA ===== */}
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-20">
            <div className="text-white text-6xl font-bold opacity-5 rotate-[-30deg] select-none">
              SOLO LECTURA
            </div>
          </div>
        </div>
      </div>


      {/* ===== CONTROLES FLOTANTES ===== */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-gray-800 text-white rounded-xl px-5 py-3 flex items-center gap-6 shadow-xl">
        {/* Paginación */}
        <div className="flex items-center gap-2">
          <button onClick={prevPage} disabled={pageNumber <= 1}>
            ◀
          </button>
          <span className="text-sm">
            {pageNumber} / {numPages ?? '—'}
          </span>
          <button onClick={nextPage} disabled={pageNumber >= (numPages ?? 1)}>
            ▶
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-2">
          <button onClick={zoomOut}>−</button>
          <span className="text-sm">
            {Math.round(scale * 100)}%
          </span>
          <button onClick={zoomIn}>+</button>
          <button onClick={resetZoom} className="text-xs opacity-70">
            Reset
          </button>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="bg-gray-800 text-gray-400 text-xs py-2 text-center">
        Documento protegido — no descarga — no impresión
      </div>
    </div >
  );
}
