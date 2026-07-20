// Statistiques respectueuses de la vie privée (GoatCounter) — sans cookies, RGPD-friendly.
// 1. Crée un compte gratuit sur https://www.goatcounter.com/ et choisis un « code ».
//    Ton tableau de bord sera alors https://<CODE>.goatcounter.com
// 2. Remplace la valeur de CODE ci-dessous par ce code, puis pousse le fichier.
// Tant que CODE contient « XXXX », aucun script n'est chargé (rien de cassé).
(function () {
  var CODE = 'lcir'; // tableau de bord : https://lcir.goatcounter.com

  if (!CODE || CODE.indexOf('XXXX') !== -1) return; // non configuré
  var host = location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host === '') return; // pas de comptage en local

  var endpoint = 'https://' + CODE + '.goatcounter.com/count';
  window.goatcounter = window.goatcounter || {};
  window.goatcounter.endpoint = endpoint;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', endpoint);
  (document.head || document.documentElement).appendChild(s);
})();
