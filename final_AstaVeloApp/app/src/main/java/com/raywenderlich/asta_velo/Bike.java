/*
 * Copyright (c) 2016 Razeware LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

package com.raywenderlich.asta_velo;

public class Bike {
  private final int id;
  private final int size;
  private boolean isFavorite = false;
  private final String imageUrl;
  private final int number_of_gears;
  private final int number_of_loans;
  private final int inventory_number;
  private final boolean isAvailable;
  private final String type;
  private final String information;
  private final String type_of_breaks;



  public Bike(int id, int size, String imageUrl, int number_of_gears, String type_of_breaks, boolean isAvailable, int number_of_loans, String type, int inventory_number, String information) {
    this.id = id;
    this.size = size;
    this.imageUrl = imageUrl;
    this.number_of_gears = number_of_gears;
    this.type_of_breaks = type_of_breaks;
    this.isAvailable = isAvailable;
    this.number_of_loans = number_of_loans;
    this.inventory_number = inventory_number;
    this.type = type;
    this.information = information;
  }

  public int getId() {
    return id;
  }

  public int getSize() {
    return size;
  }

  public boolean isFavorite() {
    return isFavorite;
  }

  public void setFavorite(boolean favorite) {
    isFavorite = favorite;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public int getNumber_of_gears() {
    return number_of_gears;
  }

  public int getNumber_of_loans() {
    return number_of_loans;
  }

  public int getInventory_number() {
    return inventory_number;
  }

  public boolean isAvailable() {
    return isAvailable;
  }

  public String getType() {
    return type;
  }

  public String getInformation() {
    return information;
  }

  public String getType_of_breaks() {
    return type_of_breaks;
  }

  public void toggleFavorite() {
    if(isFavorite){
      isFavorite = false;
    }else{
      isFavorite = true;
    }
  }
}
