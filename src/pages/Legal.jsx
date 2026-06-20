import React from "react";
import { C, FS } from "../constants";
import Footer from "../components/Footer";

export default function Legal({ go }) {
  return (
    <div style={{ padding: "clamp(32px,6vw,80px) clamp(16px,4vw,48px) 0" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{
            fontSize: 10, fontWeight: 600, color: "#000",
            background: C.gold, padding: "3px 10px",
            borderRadius: 2, letterSpacing: "0.08em",
          }}>LEGAL NOTICE & DISCLAIMER</span>
          <h1 style={{
            fontFamily: FS, fontSize: "clamp(28px,4vw,44px)", fontWeight: 400,
            color: C.white, marginTop: 20, lineHeight: 1.2,
          }}>Legal Notice & Disclaimer</h1>
          <p style={{ fontSize: 14, color: C.muted, marginTop: 14, lineHeight: 1.8 }}>
            Important legal and regulatory information about DotVests Technologies Limited.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))",
          gap: 48,
        }}>
          <div>
            <div style={{
              fontSize: 11, color: C.gold, letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: 14,
            }}>Pre-Launch & Regulatory Status</div>

            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.9, marginBottom: 20 }}>
              DotVests Technologies Limited is a company incorporated in Nigeria under the Companies
              and Allied Matters Act (CAMA) with the Corporate Affairs Commission (CAC). DotVests is
              currently in <strong style={{ color: C.white }}>pre-launch phase</strong> and does not
              offer, solicit, or facilitate any form of investment, securities trading, or financial
              services of any kind at this time.
            </p>

            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.9, marginBottom: 20 }}>
              DotVests is actively pursuing registration and approval under the{" "}
              <strong style={{ color: C.white }}>
                Securities and Exchange Commission (SEC) Nigeria Advanced Regulatory Incubation
                Programme (ARIP)
              </strong>
              . Until such approval is granted, DotVests operates strictly as an information and
              waitlist platform. Nothing on this website constitutes a prospectus, an offer to sell
              securities, or an invitation to invest.
            </p>

            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.9 }}>
              All content on this platform is for{" "}
              <strong style={{ color: C.white }}>
                informational and educational purposes only
              </strong>
              . Simulated asset prices, portfolio figures, and market data displayed on this website
              are entirely fictional and do not represent actual market values, investment
              performance, or guaranteed returns.
            </p>
          </div>

          <div>
            <div style={{
              fontSize: 11, color: C.gold, letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: 14,
            }}>Third-Party Names, Brands & Trademarks</div>

            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.9, marginBottom: 20 }}>
              This website references the names, brands, logos, and trademarks of third-party
              companies including but not limited to{" "}
              <strong style={{ color: C.white }}>
                MTN Nigeria Communications Plc, Guaranty Trust Holding Company Plc (GTCO),
                PiggyVest, Chowdeck, Erisco Foods Limited, Carbon (One Finance), Dangote Cement Plc,
                and Zenith Bank Plc
              </strong>
              .
            </p>

            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.9, marginBottom: 20 }}>
              All such references are made solely for the purpose of{" "}
              <strong style={{ color: C.white }}>
                illustrating DotVests' intended business model and tokenization pipeline
              </strong>
              . The mention of any company name does not imply, represent, or constitute: (a) any
              existing partnership, commercial agreement, or endorsement with or by that company; (b)
              any authority or licence to tokenize, sell, or distribute securities of that company;
              or (c) any affiliation, association, or approval by that company or its affiliates.
            </p>

            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.9 }}>
              DotVests will only tokenize the equity of any company following the execution of a
              formal, legally binding partnership agreement and all requisite regulatory approvals.
              All company names and marks remain the exclusive property of their respective owners.
            </p>

            <div style={{
              fontSize: 11, color: C.gold, letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: 14, marginTop: 32,
            }}>No Investment Advice · No Liability</div>

            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.9 }}>
              Nothing on this website constitutes financial, investment, legal, or tax advice.
              DotVests, its directors, employees, and affiliates accept no liability for any loss or
              damage arising from reliance on information contained herein. Prospective investors
              should conduct independent due diligence and seek independent professional advice
              before making any investment decision. Investment in securities involves risk, including
              the possible loss of principal.
            </p>
          </div>
        </div>

        <div style={{
          marginTop: 40, paddingTop: 20,
          borderTop: `0.5px solid ${C.brd}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
        }}>
          <span style={{ fontSize: 12, color: C.dim }}>
            © 2026 DotVests Technologies Limited · RC Number: [CAC Registration] · Uyo, Akwa Ibom State, Nigeria
          </span>
          <span style={{ fontSize: 12, color: C.dim }}>
            Last updated: May 2026
          </span>
        </div>
      </div>

      <div style={{ marginTop: 72 }}><Footer go={go} /></div>
    </div>
  );
}
