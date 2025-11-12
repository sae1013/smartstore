export const genHtmlTemplate = (...args) => {
  const html = `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f7fb;">
    <tr>
      <td align="center" style="padding:24px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <!-- 헤더 -->
          <tr>
            <td style="background:#111827;padding:20px 24px;">
              <h1 style="margin:0;font-size:18px;line-height:24px;color:#ffffff;font-weight:600;">
                애플 기프트샵
              </h1>
            </td>
          </tr>

          <!-- 본문 -->
          <tr>
            <td style="padding:28px 24px 8px 24px;font-family:Apple SD Gothic Neo, Malgun Gothic, 'Segoe UI', Arial, sans-serif;color:#111827;">
              <p style="margin:0 0 16px 0;font-size:16px;line-height:24px;">
                안녕하세요 <strong>${args[0]}</strong> 님, 애플 기프트샵입니다.
              </p>
              <p style="margin:0 0 16px 0;font-size:16px;line-height:24px;">
                주문하신 제품의 리딤코드를 발송드립니다.
              </p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:12px 0 20px 0;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;width:100%;">
                <tr>
                  <td style="padding:16px 18px;font-size:15px;line-height:22px;color:#111827;">
                    <strong style="display:inline-block;width:84px;">제품코드</strong>
                    <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;
                                 background:#ecfdf5;border:1px solid #86efac;border-radius:6px;padding:4px 8px;
                                 color:#16a34a;white-space:nowrap;display:inline-block;">
                        ${args[1]}
                    </span>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px 0;font-size:15px;line-height:22px;color:#374151;">
                감사합니다.
              </p>

              <p style="margin:0;font-size:14px;line-height:22px;color:#6b7280;">
                추가 문의사항은 네이버 스토어 톡톡으로 문의부탁드립니다.
              </p>
            </td>
          </tr>

          <!-- 푸터 -->
          <tr>
            <td style="padding:18px 24px 24px 24px;color:#6b7280;font-size:12px;line-height:18px;font-family:Apple SD Gothic Neo, Malgun Gothic, 'Segoe UI', Arial, sans-serif;">
              © 애플 기프트샵 • 본 메일은 발신전용입니다.
            </td>
          </tr>
        </table>`;

  return html;
};
