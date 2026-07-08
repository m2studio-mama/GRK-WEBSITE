import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateMembershipCard = async (
  memberData: {
    name: string;
    memberId: string;
    district: string;
    state: string;
    joinDate: string;
    photo: string;
    designation?: string;
  }
): Promise<{ pngUrl: string; pdfUrl: string }> => {
  // Create a temporary container for the card
  const cardContainer = document.createElement('div');
  cardContainer.style.cssText = `
    width: 500px;
    height: 320px;
    position: absolute;
    left: -9999px;
    background: linear-gradient(135deg, #0B0F19 0%, #1a2947 100%);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(255, 215, 0, 0.1);
    color: white;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    border: 2px solid #FFD700;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `;

  // Card header with logo area
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    border-bottom: 1px solid #FFD700;
    padding-bottom: 12px;
  `;

  const logoText = document.createElement('div');
  logoText.style.cssText = `
    font-size: 18px;
    font-weight: bold;
    color: #FFD700;
    text-transform: uppercase;
    letter-spacing: 2px;
  `;
  logoText.textContent = 'GRK Fan Club';
  header.appendChild(logoText);

  // Member content
  const content = document.createElement('div');
  content.style.cssText = `
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 12px;
  `;

  // Photo section
  const photoDiv = document.createElement('div');
  photoDiv.style.cssText = `
    width: 80px;
    height: 80px;
    border-radius: 8px;
    border: 2px solid #FFD700;
    overflow: hidden;
    flex-shrink: 0;
  `;
  
  const photo = document.createElement('img');
  photo.src = memberData.photo;
  photo.style.cssText = `
    width: 100%;
    height: 100%;
    object-fit: cover;
  `;
  photoDiv.appendChild(photo);
  content.appendChild(photoDiv);

  // Member info section
  const infoDiv = document.createElement('div');
  infoDiv.style.cssText = `
    flex: 1;
  `;

  const name = document.createElement('div');
  name.style.cssText = `
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 4px;
    color: #FFD700;
  `;
  name.textContent = memberData.name;
  infoDiv.appendChild(name);

  const memberId = document.createElement('div');
  memberId.style.cssText = `
    font-size: 12px;
    color: #b0b0b0;
    margin-bottom: 6px;
  `;
  memberId.innerHTML = `<strong>ID:</strong> ${memberData.memberId}`;
  infoDiv.appendChild(memberId);

  const details = document.createElement('div');
  details.style.cssText = `
    font-size: 11px;
    color: #888;
    line-height: 1.6;
  `;
  details.innerHTML = `
    <div><strong>District:</strong> ${memberData.district}</div>
    <div><strong>Joined:</strong> ${memberData.joinDate}</div>
  `;
  infoDiv.appendChild(details);
  content.appendChild(infoDiv);

  // Footer with website
  const footer = document.createElement('div');
  footer.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    color: #888;
    border-top: 1px solid rgba(255, 215, 0, 0.3);
    padding-top: 8px;
  `;

  const website = document.createElement('div');
  website.textContent = 'www.gauthamramkarthik.com';
  footer.appendChild(website);

  const year = document.createElement('div');
  year.style.color = '#FFD700';
  year.textContent = new Date().getFullYear().toString();
  footer.appendChild(year);

  cardContainer.appendChild(header);
  cardContainer.appendChild(content);
  cardContainer.appendChild(footer);
  document.body.appendChild(cardContainer);

  try {
    // Generate PNG
    const canvas = await html2canvas(cardContainer, {
      backgroundColor: null,
      scale: 2,
      logging: false,
    });
    const pngUrl = canvas.toDataURL('image/png');

    // Generate PDF
    const pdf = new jsPDF('landscape', 'mm', [85, 55]);
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 85, 55);
    const pdfUrl = pdf.output('dataurlstring');

    return { pngUrl, pdfUrl };
  } finally {
    document.body.removeChild(cardContainer);
  }
};

export const downloadCard = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
