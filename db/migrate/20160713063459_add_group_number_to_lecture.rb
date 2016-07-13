class AddGroupNumberToLecture < ActiveRecord::Migration
  def change
    # not really a number, but a string like "L01", "L02", and etc.
    add_column :lectures, :group_number, :string
  end
end
