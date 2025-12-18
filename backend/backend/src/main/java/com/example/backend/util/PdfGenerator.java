package com.example.backend.util;

import com.example.backend.model.Treatment;
import com.example.backend.model.UserDetail;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import java.awt.Color;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class PdfGenerator {
    private static final float MARGIN = 50;
    private static final float LEADING = 16;

    private static final Color[] BG_COLORS = {
            new Color(245, 245, 245),
            new Color(230, 230, 230)
    };

    public static byte[] generatePdf(UserDetail user, List<Treatment> prescriptions) throws IOException {
        PDDocument doc = new PDDocument();
        PDPage page = new PDPage(PDRectangle.A4);
        doc.addPage(page);

        PDPageContentStream cs = new PDPageContentStream(doc, page);
        float y = page.getMediaBox().getHeight() - MARGIN;

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM yyyy");

        y = drawText(cs, "Patient Report", 20, y, true);
        y -= 20;

        y = drawText(cs, "Name: " + user.getFirstName(), 12, y, false);
        y = drawText(cs, "Sex: " + user.getSex(), 12, y, false);
        y = drawText(cs, "Birth Date: " + user.getDateOfBirth(), 12, y, false);
        y = drawText(cs, "Height: " + user.getHeight(), 12, y, false);
        y = drawText(cs, "Weight: " + user.getWeight(), 12, y, false);
        y = drawText(cs, "Extra Info: " + (user.getExtraInfo()==null?"-":user.getExtraInfo()), 12, y, false);

        y -= 20;

        y = drawText(cs, "Prescriptions:", 16, y, true);
        y -= 10;

        String[] headers = {"Medication", "Dosage", "Times/Day", "Start", "End"};
        float tableY = y;
        float tableRowHeight = 20;
        float tableWidth = page.getMediaBox().getWidth() - 2 * MARGIN;
        float[] colWidths = {tableWidth * 0.25f, tableWidth * 0.15f, tableWidth * 0.15f, tableWidth * 0.225f, tableWidth * 0.225f};

        cs.setNonStrokingColor(Color.LIGHT_GRAY);
        cs.addRect(MARGIN, tableY - tableRowHeight, tableWidth, tableRowHeight);
        cs.fill();
        cs.setNonStrokingColor(Color.BLACK);

        float textY = tableY - 15;
        float x = MARGIN;
        for (int i = 0; i < headers.length; i++) {
            drawTextAt(cs, headers[i], 12, x, textY, true);
            x += colWidths[i];
        }

        tableY -= tableRowHeight;

        int index = 0;
        for (Treatment p : prescriptions) {
            Color bg = BG_COLORS[index % BG_COLORS.length];
            index++;

            cs.setNonStrokingColor(bg);
            cs.addRect(MARGIN, tableY - tableRowHeight, tableWidth, tableRowHeight);
            cs.fill();
            cs.setNonStrokingColor(Color.BLACK);

            String[] rowData = {
                    p.getMedicationName(),
                    p.getDosage(),
                    String.valueOf(p.getTimesPerDay()),
                    p.getStartDate().toString(),
                    p.getEndDate().toString()
            };

            String[][] wrappedCells = new String[rowData.length][];
            int maxLines = 1;
            for (int i = 0; i < rowData.length; i++) {
                wrappedCells[i] = wrapText(rowData[i], 12, colWidths[i]);
                if (wrappedCells[i].length > maxLines) maxLines = wrappedCells[i].length;
            }

            float actualRowHeight = tableRowHeight * maxLines;
            float lineHeight = LEADING;

            for (int line = 0; line < maxLines; line++) {
                textY = tableY - 15 - line * lineHeight;
                x = MARGIN;
                for (int i = 0; i < rowData.length; i++) {
                    if (line < wrappedCells[i].length) {
                        drawTextAt(cs, wrappedCells[i][line], 12, x, textY, false);
                    }
                    x += colWidths[i];
                }
            }

            tableY -= actualRowHeight;

            if (tableY < MARGIN) {
                cs.close();
                page = new PDPage(PDRectangle.A4);
                doc.addPage(page);
                cs = new PDPageContentStream(doc, page);
                tableY = page.getMediaBox().getHeight() - MARGIN;
            }
        }

        y = tableY - 10;

        cs.close();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        doc.save(baos);
        doc.close();
        return baos.toByteArray();
    }

    private static float drawText(PDPageContentStream cs, String text, int size, float y,
                                  boolean bold) throws IOException {
        cs.beginText();
        cs.setFont(bold ? PDType1Font.HELVETICA_BOLD : PDType1Font.HELVETICA, size);
        cs.newLineAtOffset(MARGIN, y);
        cs.showText(text);
        cs.endText();
        return y - LEADING;
    }

    private static float drawWrappedText(PDDocument doc, PDPage page, PDPageContentStream cs, String text, int size,
                                         float y) throws IOException {

        cs.setFont(PDType1Font.HELVETICA, size);
        float maxWidth = page.getMediaBox().getWidth() - 2 * MARGIN;

        String[] words = text.split(" ");
        StringBuilder line = new StringBuilder();

        for (String w : words) {
            String testLine = line + w + " ";
            float width = (PDType1Font.HELVETICA.getStringWidth(testLine) / 1000) * size;

            if (width > maxWidth) {
                y = drawText(cs, line.toString(), size, y, false);
                line = new StringBuilder(w + " ");
            } else {
                line = new StringBuilder(testLine);
            }
        }

        if (!line.isEmpty()) {
            y = drawText(cs, line.toString(), size, y, false);
        }

        return y;
    }

    private static void drawTextAt(PDPageContentStream cs, String text, int size, float x, float y, boolean bold) throws IOException {
        cs.beginText();
        cs.setFont(bold ? PDType1Font.HELVETICA_BOLD : PDType1Font.HELVETICA, size);
        cs.newLineAtOffset(x, y);
        cs.showText(text);
        cs.endText();
    }

    private static String[] wrapText(String text, int fontSize, float colWidth) throws IOException {
        String[] words = text.split(" ");
        StringBuilder line = new StringBuilder();
        java.util.List<String> lines = new java.util.ArrayList<>();

        for (String w : words) {
            String testLine = line.length() == 0 ? w : line + " " + w;
            float width = (PDType1Font.HELVETICA.getStringWidth(testLine) / 1000f) * fontSize;
            if (width > colWidth) {
                if (line.length() > 0) lines.add(line.toString());
                line = new StringBuilder(w);
            } else {
                line = new StringBuilder(testLine);
            }
        }
        if (line.length() > 0) lines.add(line.toString());
        return lines.toArray(new String[0]);
    }
}
