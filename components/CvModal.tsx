"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CV_OPEN_EVENT } from "@/components/CvButton";
import type { CvOpenDetail } from "@/components/CvButton";
import { cvs } from "@/content/data";
import type { Cv } from "@/content/data";

/**
 * Fenêtre des CV : étape 1, choix entre les deux CV (avec aperçu) ;
 * étape 2, lecture du PDF avec téléchargement ou ouverture dans un onglet.
 */
export default function CvModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Cv | null>(null);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const { id } = (event as CustomEvent<CvOpenDetail>).detail ?? {};
      const cv = id ? cvs.find((item) => item.id === id && item.file) : undefined;
      setSelected(cv ?? null);
      const dialog = dialogRef.current;
      if (dialog && !dialog.open) {
        dialog.showModal();
        document.body.style.overflow = "hidden";
      }
    };
    window.addEventListener(CV_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CV_OPEN_EVENT, onOpen);
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="cv-modal"
      aria-labelledby="cv-modal-titre"
      onClose={() => {
        document.body.style.overflow = "";
        setSelected(null);
      }}
      onClick={(event) => {
        // Clic sur le fond (hors de la boîte) : fermeture
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="cv-modal__boite">
        <div className="cv-modal__tete">
          {selected ? (
            <button type="button" className="cv-modal__retour" onClick={() => setSelected(null)}>
              ← Retour
            </button>
          ) : (
            <p className="etiquette">MES CV</p>
          )}
          <button type="button" className="cv-modal__fermer" onClick={close} aria-label="Fermer">
            ✕
          </button>
        </div>

        {selected?.file ? (
          <div className="cv-lecteur">
            <div className="cv-lecteur__barre">
              <div>
                <h2 id="cv-modal-titre" className="cv-modal__titre">
                  {selected.title.toUpperCase()}
                </h2>
                <p className="cv-modal__sous-titre">{selected.subtitle}</p>
              </div>
              <div className="cv-lecteur__actions">
                <a className="bouton bouton--contour bouton--50" href={selected.file} target="_blank" rel="noreferrer">
                  OUVRIR
                </a>
                <a className="bouton bouton--plein bouton--50" href={selected.file} download={selected.downloadName}>
                  TÉLÉCHARGER
                </a>
              </div>
            </div>
            <div className="cv-lecteur__document">
              <iframe
                className="cv-lecteur__pdf"
                src={`${selected.file}#view=FitH&toolbar=0&navpanes=0`}
                title={`Aperçu du ${selected.title}`}
              />
              {/* Les navigateurs mobiles n'affichent pas toujours un PDF intégré :
                  on y montre l'image de la première page. */}
              {selected.preview ? (
                <img className="cv-lecteur__image" src={selected.preview} alt={`Première page du ${selected.title}`} />
              ) : null}
            </div>
          </div>
        ) : (
          <div className="cv-choix">
            <h2 id="cv-modal-titre" className="cv-modal__titre">
              QUEL CV VEUX-TU VOIR ?
            </h2>
            <ul className="cv-choix__liste">
              {cvs.map((cv) => (
                <li key={cv.id}>
                  <button
                    type="button"
                    className="cv-carte"
                    disabled={!cv.file}
                    onClick={() => setSelected(cv)}
                  >
                    <span className="cv-carte__apercu">
                      {cv.preview ? (
                        <img src={cv.preview} alt="" />
                      ) : (
                        <span className="cv-carte__vide">Bientôt disponible</span>
                      )}
                    </span>
                    <span className="cv-carte__texte">
                      <span className="cv-carte__titre">{cv.title}</span>
                      <span className="cv-carte__sous-titre">{cv.subtitle}</span>
                    </span>
                    {cv.file ? (
                      <span className="cv-carte__action" aria-hidden="true">
                        VISUALISER →
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </dialog>
  );
}
