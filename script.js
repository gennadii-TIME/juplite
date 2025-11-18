// Jupiter referral account (твой адрес)
const REFERRAL_ACCOUNT = "5AnFdipAt5jhyhtP2ccMHVjMzC1LFAwRKEQiCtQsdHPz";
// 0.5% реферальная комиссия (50 bps). Можешь потом поменять.
const REFERRAL_FEE_BPS = 50;

window.addEventListener("load", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

  if (!window.Jupiter) {
    console.error("Jupiter Plugin not loaded");
    return;
  }

  window.Jupiter.init({
    displayMode: "integrated",
    integratedTargetId: "jupiter-plugin",
    containerStyles: {
      width: "100%",
      height: "520px",
      borderRadius: "16px",
      overflow: "hidden",
    },
    branding: {
      name: "Juplite",
      logoUri: "https://juplite.com/ui-logo-64.png",
    },
    formProps: {
      referralAccount: REFERRAL_ACCOUNT,
      referralFee: REFERRAL_FEE_BPS,
    },
  });
});
